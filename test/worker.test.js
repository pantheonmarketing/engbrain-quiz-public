import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  buildSalesQualification,
  buildTelegramMessage,
  handleCrmRequest,
  handleLeadRequest,
  normalizeLead,
} from '../src/worker.js';

function request(body, headers = {}) {
  return new Request('https://engbrain.example.com/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

test('homepage installs Meta Pixel 1260721357598576 before launch', () => {
  const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');

  assert.match(html, /connect\.facebook\.net\/en_US\/fbevents\.js/);
  assert.match(html, /fbq\('init',\s*'1260721357598576'\)/);
  assert.match(html, /fbq\('track',\s*'PageView'\)/);
  assert.match(html, /facebook\.com\/tr\?id=1260721357598576&ev=PageView&noscript=1/);
  assert.doesNotMatch(html, /YOUR_PIXEL_ID|PIXEL_ID/);
});

function createKv() {
  const map = new Map();
  return {
    map,
    async get(key) { return map.get(key) ?? null; },
    async put(key, value) { map.set(key, value); },
    async delete(key) { map.delete(key); },
    async list(options = {}) {
      const prefix = options.prefix || '';
      const keys = [...map.keys()]
        .filter((name) => name.startsWith(prefix))
        .sort()
        .map((name) => ({ name }));
      return { keys, list_complete: true };
    },
  };
}

function crmRequest(path, options = {}) {
  return new Request(`https://engbrain.example.com${path}`, options);
}

function basicAuth(username = 'sales', password = 'secret') {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

test('normalizeLead keeps only safe expected lead fields', () => {
  const lead = normalizeLead({
    answers: { 1: 'parent', 10: { name: '  Nok  ', phone: ' 0812345678 ', line: '@nok', childAge: ' 5 ', extra: 'drop' } },
    path: 'parent',
    match: { title: 'Jolly Phonics Level 1', extra: '<script>' },
    unexpected: 'drop me',
  });

  assert.deepEqual(Object.keys(lead).sort(), ['answers', 'match', 'path', 'receivedAt', 'source'].sort());
  assert.equal(lead.answers['10'].name, 'Nok');
  assert.equal(lead.answers['10'].phone, '0812345678');
  assert.equal(lead.answers['10'].childAge, '5');
  assert.equal(lead.answers['10'].extra, undefined);
  assert.equal(lead.match.title, 'Jolly Phonics Level 1');
  assert.equal(lead.match.extra, undefined);
});

test('buildSalesQualification scores hot parent leads and writes the sales angle', () => {
  const qualification = buildSalesQualification({
    path: 'parent',
    match: { title: 'Jolly Phonics Level 1' },
    answers: {
      2: { name: 'Prim', age: '7', grade: 'Grade 1' },
      4: 'confident',
      5: 'done',
      6: ['reading', 'confidence'],
      7: 'now',
      8: '1on1',
      9: '3-6k',
      10: { name: 'Nok', phone: '0812345678', line: '@nok' },
    },
  });

  assert.equal(qualification.priority, 'HOT');
  assert.equal(qualification.score, 9);
  assert.match(qualification.summary, /Ready now/);
  assert.match(qualification.summary, /1:1 Private/);
  assert.match(qualification.summary, /฿3,000–6,000/);
  assert.match(qualification.salesAngle, /phonics foundation/i);
  assert.match(qualification.followUp, /Hi Nok/);
  assert.match(qualification.followUp, /Prim/);
  assert.match(qualification.followUp, /Jolly Phonics Level 1/);
});

test('buildSalesQualification labels low-budget research leads as nurture', () => {
  const qualification = buildSalesQualification({
    path: 'parent',
    match: { title: 'Engbrain Starter Pack' },
    answers: {
      2: { name: 'Beam', age: '6', grade: 'K3' },
      4: 'no',
      6: ['reading'],
      7: 'research',
      8: 'books',
      9: '<1k',
      10: { name: 'May', phone: '0812345678' },
    },
  });

  assert.equal(qualification.priority, 'NURTURE');
  assert.ok(qualification.score <= 3);
  assert.match(qualification.nextAction, /low-pressure/i);
});

test('buildSalesQualification handles mom path as SmartMom coupon lead', () => {
  const qualification = buildSalesQualification({
    path: 'mom',
    match: { title: 'SmartMom' },
    answers: {
      1: 'mom',
      11: 'pronunciation',
      12: 'not-sure',
      13: 'few-words',
      14: 'confidence',
      15: 'yes-guidance',
      10: { name: 'Bee', phone: '0812345678', line: '@bee', childAge: '5' },
    },
  });

  assert.equal(qualification.priority, 'HOT');
  assert.match(qualification.summary, /SmartMom coupon lead/);
  assert.match(qualification.summary, /Child age: 5/);
  assert.match(qualification.summary, /Few words/);
  assert.match(qualification.salesAngle, /44 English sounds/i);
  assert.match(qualification.salesAngle, /first English teacher/i);
  assert.match(qualification.nextAction, /SMARTMOM15/);
  assert.match(qualification.nextAction, /24 hours/);
  assert.match(qualification.followUp, /Hi Bee/);
  assert.match(qualification.followUp, /15% off SmartMom/);
  assert.match(qualification.followUp, /SMARTMOM15/);
});

test('buildSalesQualification scores hot teacher school partnership leads', () => {
  const qualification = buildSalesQualification({
    path: 'teacher',
    match: { title: 'Engbrain Teacher Partnership' },
    answers: {
      1: 'teacher',
      16: 'owner',
      17: 'g1-g3',
      18: ['curriculum', 'licensing', 'training'],
      19: '31-100',
      20: 'immediate',
      10: { name: 'Kru Ann', phone: '0812345678', line: '@kruann', school: 'Bright Kids', role: 'Owner' },
    },
  });

  assert.equal(qualification.priority, 'HOT');
  assert.match(qualification.summary, /School or learning-center partnership/);
  assert.match(qualification.summary, /Bright Kids/);
  assert.match(qualification.summary, /31–100/);
  assert.match(qualification.salesAngle, /curriculum licensing/i);
  assert.match(qualification.salesAngle, /implementation support/i);
  assert.match(qualification.nextAction, /decision-maker/i);
  assert.match(qualification.followUp, /Hi Kru Ann/);
  assert.match(qualification.followUp, /Engbrain Teacher Partnership/);
});

test('buildTelegramMessage sends Thai teacher qualification details for sales team', () => {
  const msg = buildTelegramMessage({
    path: 'teacher',
    match: { title: 'Engbrain Teacher Partnership' },
    answers: {
      1: 'teacher',
      16: 'teacher',
      17: 'kindergarten',
      18: ['worksheets', 'lesson-plans'],
      19: '6-15',
      20: 'this-term',
      10: { name: 'Kru May', phone: '0812345678', line: '@krumay', school: 'ABC School', role: 'K2 teacher' },
    },
  });

  assert.match(msg, /ลีดใหม่จากแบบทดสอบ Engbrain/);
  assert.match(msg, /ประเภทลูกค้า: ครู\/โรงเรียน/);
  assert.match(msg, /โรงเรียน\/ศูนย์: ABC School/);
  assert.match(msg, /ตำแหน่ง: K2 teacher/);
  assert.match(msg, /ประเภทครู: ครูรายบุคคล/);
  assert.match(msg, /จำนวนนักเรียน: 6–15/);
  assert.match(msg, /ต้องการ: ชุดใบงาน\/แพ็กนักเรียน, แผนการสอน\/สคริปต์สอน/);
  assert.doesNotMatch(msg, /Teacher type:|Students:|Needs:/);
});

test('buildTelegramMessage sends Thai qualification summary and suggested follow-up', () => {
  const msg = buildTelegramMessage({
    path: 'parent',
    match: { title: 'Jolly Phonics Level 1' },
    answers: {
      2: { name: 'Prim', age: '7', grade: 'Grade 1' },
      4: 'confident',
      5: 'done',
      6: ['reading', 'confidence'],
      7: 'now',
      8: '1on1',
      9: '3-6k',
      10: { name: 'Nok', phone: '0812345678', line: '@nok' },
    },
  });

  assert.match(msg, /ลีดใหม่จากแบบทดสอบ Engbrain/);
  assert.match(msg, /ชื่อลูกค้า: Nok/);
  assert.match(msg, /ข้อมูลเด็ก: Prim/);
  assert.match(msg, /ความสำคัญ: HOT/);
  assert.match(msg, /สรุปลีด:/);
  assert.match(msg, /มุมขาย:/);
  assert.match(msg, /ข้อความแนะนำให้เซลส์ส่ง:/);
  assert.match(msg, /คอร์สที่แนะนำ: Jolly Phonics Level 1/);
  assert.doesNotMatch(msg, /New Engbrain Quiz Lead|Sales angle:|Suggested reply:|RECOMMENDED:/);
  assert.doesNotMatch(msg, /bot\d+:/i);
});

test('handleLeadRequest stores leads and sends Telegram server-side', async () => {
  const kv = createKv();
  const telegramCalls = [];
  const env = {
    LEADS_KV: kv,
    TELEGRAM_BOT_TOKEN: 'secret-token',
    TELEGRAM_CHAT_ID: '12345',
  };

  const res = await handleLeadRequest(request({
    path: 'parent',
    match: { title: 'Jolly Phonics Level 1' },
    answers: { 10: { name: 'Nok', phone: '0812345678', line: '@nok' } },
  }, { 'CF-Connecting-IP': '203.0.113.9' }), env, {
    fetch: async (url, init) => {
      telegramCalls.push({ url, init });
      return new Response('{"ok":true}', { status: 200 });
    },
    now: () => 1700000000000,
    randomUUID: () => 'lead-1',
  });

  assert.equal(res.status, 200);
  assert.equal((await res.json()).ok, true);
  assert.equal(telegramCalls.length, 1);
  assert.match(String(telegramCalls[0].url), /^https:\/\/api\.telegram\.org\/botsecret-token\/sendMessage$/);
  assert.equal(kv.map.has('lead:1700000000000:lead-1'), true);
  const stored = JSON.parse(kv.map.get('lead:1700000000000:lead-1'));
  assert.equal(stored.qualification.priority, 'NURTURE');
  assert.match(stored.qualification.followUp, /Hi Nok/);
});

test('handleLeadRequest rate limits repeated submissions by IP', async () => {
  const kv = createKv();
  const env = { LEADS_KV: kv };
  const deps = { now: () => 1700000000000, randomUUID: () => 'same' };

  for (let i = 0; i < 5; i++) {
    const res = await handleLeadRequest(request({ answers: { 10: { name: 'Nok', phone: '0812345678' } } }, { 'CF-Connecting-IP': '198.51.100.2' }), env, deps);
    assert.equal(res.status, 200);
  }

  const limited = await handleLeadRequest(request({ answers: { 10: { name: 'Nok', phone: '0812345678' } } }, { 'CF-Connecting-IP': '198.51.100.2' }), env, deps);
  assert.equal(limited.status, 429);
});

test('CRM requires username and password before showing leads', async () => {
  const res = await handleCrmRequest(crmRequest('/crm'), {
    LEADS_KV: createKv(),
    CRM_USERNAME: 'sales',
    CRM_PASSWORD: 'secret',
  });

  assert.equal(res.status, 401);
  assert.match(res.headers.get('www-authenticate'), /EngBrain CRM/);
});

test('CRM page uses credential-safe API URLs for browser basic auth', async () => {
  const res = await handleCrmRequest(crmRequest('/crm', {
    headers: { authorization: basicAuth() },
  }), { LEADS_KV: createKv(), CRM_USERNAME: 'sales', CRM_PASSWORD: 'secret' });
  const html = await res.text();

  assert.match(html, /const API_BASE=location\.origin/);
  assert.doesNotMatch(html, /fetch\('\/api\/leads/);
});

test('CRM lists leads with sales status, qualification, contact info, and all answers', async () => {
  const kv = createKv();
  const lead = {
    source: 'engbrain-quiz',
    receivedAt: '2026-05-18T10:00:00.000Z',
    path: 'parent',
    answers: {
      2: { name: 'Prim', age: '7', grade: 'Grade 1' },
      6: ['reading', 'confidence'],
      10: { name: 'Nok', phone: '0812345678', line: '@nok' },
    },
    match: { title: 'Jolly Phonics Level 1' },
    qualification: { priority: 'HOT', score: 9, summary: 'Ready now', salesAngle: 'Reading confidence', nextAction: 'Call now', followUp: 'Thai message' },
  };
  await kv.put('lead:2000:b', JSON.stringify(lead));

  const res = await handleCrmRequest(crmRequest('/api/leads', {
    headers: { authorization: basicAuth() },
  }), { LEADS_KV: kv, CRM_USERNAME: 'sales', CRM_PASSWORD: 'secret' });
  const data = await res.json();

  assert.equal(res.status, 200);
  assert.equal(data.leads.length, 1);
  assert.equal(data.leads[0].id, 'lead:2000:b');
  assert.equal(data.leads[0].contact.name, 'Nok');
  assert.equal(data.leads[0].qualification.priority, 'HOT');
  assert.equal(data.leads[0].sales.owner, '');
  assert.equal(data.leads[0].sales.status, 'ใหม่');
  assert.deepEqual(data.leads[0].answers['6'], ['reading', 'confidence']);
});

test('CRM updates caller, channel status, lead status, next follow-up, and notes', async () => {
  const kv = createKv();
  await kv.put('lead:1000:a', JSON.stringify({
    source: 'engbrain-quiz',
    receivedAt: '2026-05-18T09:00:00.000Z',
    path: 'mom',
    answers: { 10: { name: 'Bee', phone: '0812345678', line: '@bee' } },
    match: { title: 'SmartMom' },
    qualification: { priority: 'WARM', score: 5 },
  }));

  const res = await handleCrmRequest(crmRequest('/api/leads/lead%3A1000%3Aa', {
    method: 'PATCH',
    headers: { authorization: basicAuth(), 'content-type': 'application/json' },
    body: JSON.stringify({
      owner: 'Kru Bow Sales 1',
      status: 'กำลังติดต่อ',
      channel: 'โทรแล้ว + LINE',
      nextFollowUp: '2026-05-20',
      notes: 'สนใจ SmartMom รอคุยตอนเย็น',
    }),
  }), { LEADS_KV: kv, CRM_USERNAME: 'sales', CRM_PASSWORD: 'secret' }, { now: () => 1800000000000 });
  const data = await res.json();
  const stored = JSON.parse(kv.map.get('lead:1000:a'));

  assert.equal(res.status, 200);
  assert.equal(data.lead.sales.owner, 'Kru Bow Sales 1');
  assert.equal(stored.sales.status, 'กำลังติดต่อ');
  assert.equal(stored.sales.channel, 'โทรแล้ว + LINE');
  assert.equal(stored.sales.nextFollowUp, '2026-05-20');
  assert.equal(stored.sales.notes, 'สนใจ SmartMom รอคุยตอนเย็น');
  assert.equal(stored.sales.updatedAt, new Date(1800000000000).toISOString());
});

test('CRM deletes a lead when cleaning invalid or test records', async () => {
  const kv = createKv();
  await kv.put('lead:cleanup:test', JSON.stringify({
    source: 'engbrain-quiz',
    receivedAt: '2026-05-18T09:30:00.000Z',
    answers: { 10: { name: 'Delete Me', phone: '0999999999' } },
    match: { title: 'Test Course' },
  }));

  const res = await handleCrmRequest(crmRequest('/api/leads/lead%3Acleanup%3Atest', {
    method: 'DELETE',
    headers: { authorization: basicAuth() },
  }), { LEADS_KV: kv, CRM_USERNAME: 'sales', CRM_PASSWORD: 'secret' });

  assert.equal(res.status, 200);
  assert.equal(kv.map.has('lead:cleanup:test'), false);
});

test('handleLeadRequest rejects invalid payloads', async () => {
  const res = await handleLeadRequest(request({ answers: { 10: { name: '', phone: '' } } }), { LEADS_KV: createKv() });
  assert.equal(res.status, 400);
});
