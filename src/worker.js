const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const MAX_JSON_BYTES = 25_000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

function cleanString(value, max = 500) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function cleanArray(value, maxItems = 10) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => cleanString(item, 120)).filter(Boolean);
}

function cleanObject(value, allowedKeys, max = 120) {
  const out = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  for (const key of allowedKeys) {
    if (value[key] !== undefined) out[key] = cleanString(value[key], max);
  }
  return out;
}

export function normalizeLead(payload, deps = {}) {
  const nowIso = new Date(deps.now?.() ?? Date.now()).toISOString();
  const rawAnswers = payload?.answers && typeof payload.answers === 'object' ? payload.answers : {};
  const answers = {};

  for (const [key, value] of Object.entries(rawAnswers)) {
    if (!/^\d+$/.test(key)) continue;
    if (Array.isArray(value)) answers[key] = cleanArray(value);
    else if (value && typeof value === 'object') {
      if (key === '2') answers[key] = cleanObject(value, ['name', 'age', 'grade']);
      else if (key === '10') answers[key] = cleanObject(value, ['name', 'phone', 'line', 'childAge', 'school', 'role']);
      else answers[key] = cleanObject(value, ['value']);
    } else {
      answers[key] = cleanString(value, 120);
    }
  }

  return {
    source: 'engbrain-quiz',
    receivedAt: nowIso,
    path: ['parent', 'mom', 'teacher'].includes(payload?.path) ? payload.path : cleanString(payload?.path || 'parent', 40),
    answers,
    match: {
      title: cleanString(payload?.match?.title || 'Unknown match', 180),
      tag: cleanString(payload?.match?.tag || '', 180),
    },
  };
}

function validateLead(lead) {
  const contact = lead.answers?.['10'] || {};
  if (!contact.name || !contact.phone) return 'Name and phone are required.';
  if (contact.phone.length < 6) return 'Phone number is too short.';
  return null;
}

const LABELS = {
  persona: { parent: 'Parent (child program)', mom: 'Mom (own English)', teacher: 'Teacher (curriculum)' },
  grade: { 'K1':'K1','K2':'K2','K3':'K3','Grade 1':'Grade 1','Grade 2':'Grade 2','Grade 3':'Grade 3','Grade 4':'Grade 4','Grade 5':'Grade 5','Grade 6':'Grade 6','Grade 7 · M1':'Grade 7 (M1)','Grade 8 · M2':'Grade 8 (M2)','Grade 9 · M3':'Grade 9 (M3)' },
  goal: { reading:'Academic reading', speak:'Speaking', 'ep-exam':'EP exam', inter:'International future', confidence:'Confidence' },
  format: { '1on1':'1:1 Private', group:'Group Zoom', video:'Video course', books:'Books', unsure:'Not sure' },
  budget: { '<1k':'<฿1,000', '1-3k':'฿1,000–3,000', '3-6k':'฿3,000–6,000', '6-9k':'฿6,000–9,900', '9k+':'฿9,900+' },
  timeline: { now:'Ready now', month:'Within 1 month', '3month':'Within 3 months', research:'Still researching' },
  momFear: { pronunciation:'Pronunciation is wrong', vocabulary:'Not enough English', mistakes:'Child may copy mistakes', shy:'Shy or embarrassed', daily:'Does not know what to say daily' },
  momSounds: { yes:'Yes, confidently', some:'Knows some', no:'Never learned properly', 'not-sure':'Not sure what the 44 sounds are' },
  momDaily: { none:'No daily English', 'few-words':'Few words', '5-10':'5–10 minutes', '10-plus':'More than 10 minutes', inconsistent:'Tries but not consistent' },
  momBlocker: { confidence:'Not confident', what:'Does not know what to teach', pronounce:'Pronunciation', child:'Child does not enjoy it', teacher:'Expects school/teacher to handle it' },
  momFit: { 'yes-self':'Yes, wants to improve herself too', 'yes-guidance':'Yes, needs guidance', simple:'Maybe, if simple', no:'No, prefers teacher to do it' },
  teacherType: { teacher:'Individual teacher', owner:'School/learning center owner', coordinator:'Head teacher / academic coordinator', tutor:'Tutor / learning center owner', homeschool:'Homeschool parent/teacher' },
  teacherAges: { kindergarten:'Kindergarten', 'g1-g3':'Primary G1–G3', 'g4-g6':'Primary G4–G6', mixed:'Mixed ages', adults:'Adults/teacher training' },
  teacherNeed: { curriculum:'Phonics curriculum', training:'Teacher training', worksheets:'Printable worksheets/student packs', 'lesson-plans':'Lesson plans/scripts', pronunciation:'Improve own pronunciation', licensing:'Licensing/partnership' },
  teacherStudents: { '1-5':'1–5', '6-15':'6–15', '16-30':'16–30', '31-100':'31–100', '100+':'100+' },
  teacherTimeline: { immediate:'Immediately', 'this-term':'This term', 'next-term':'Next term', research:'Just researching' },
};

export function buildSalesQualification(lead) {
  const answers = lead.answers || {};
  const contact = answers['10'] || {};
  const child = answers['2'] || {};
  const match = lead.match || {};
  const goals = Array.isArray(answers['6']) ? answers['6'] : [];
  const goalLabels = goals.map((g) => LABELS.goal[g] || g);

  if (lead.path === 'mom') {
    const fear = LABELS.momFear[answers['11']] || answers['11'];
    const sounds = LABELS.momSounds[answers['12']] || answers['12'];
    const daily = LABELS.momDaily[answers['13']] || answers['13'];
    const blocker = LABELS.momBlocker[answers['14']] || answers['14'];
    const fit = LABELS.momFit[answers['15']] || answers['15'];
    const enthusiastic = ['yes-self', 'yes-guidance', 'simple'].includes(answers['15']);
    const score = (enthusiastic ? 4 : 1) + (contact.line ? 1 : 0) + (contact.childAge ? 1 : 0) + (answers['13'] && answers['13'] !== '10-plus' ? 1 : 0) + (answers['12'] && answers['12'] !== 'yes' ? 1 : 0);
    const priority = enthusiastic && score >= 6 ? 'HOT' : enthusiastic ? 'WARM' : 'NURTURE';
    return {
      priority,
      score,
      summary: `SmartMom coupon lead${contact.childAge ? ` · Child age: ${contact.childAge}` : ''}${fear ? ` · Fear: ${fear}` : ''}${daily ? ` · Daily English: ${daily}` : ''}${sounds ? ` · 44 sounds: ${sounds}` : ''}${fit ? ` · Fit: ${fit}` : ''}${contact.line ? ' · LINE captured' : ''}`,
      salesAngle: `Position SmartMom as the Thai mom path to master the 44 English sounds like an English teacher and become her child’s first English teacher. Lead with her blocker${blocker ? `: ${blocker}` : ''}.`,
      nextAction: 'Contact quickly, confirm SMARTMOM15 coupon, and explain the 15% off SmartMom offer is valid for 24 hours. Course price ฿3,990.',
      followUp: `Hi ${contact.name || 'there'}, thanks for completing the Engbrain quiz. KruBow recommends SmartMom for you. You can use coupon code SMARTMOM15 to get 15% off SmartMom if you join within 24 hours. SmartMom helps Thai moms master the 44 English sounds and become their child’s first English teacher. Would you like us to send the details now?`,
    };
  }

  if (lead.path === 'teacher') {
    const needs = Array.isArray(answers['18']) ? answers['18'] : [];
    const needLabels = needs.map((n) => LABELS.teacherNeed[n] || n);
    const teacherType = LABELS.teacherType[answers['16']] || answers['16'];
    const ages = LABELS.teacherAges[answers['17']] || answers['17'];
    const students = LABELS.teacherStudents[answers['19']] || answers['19'];
    const timeline = LABELS.teacherTimeline[answers['20']] || answers['20'];
    const decisionMaker = ['owner', 'coordinator', 'tutor'].includes(answers['16']);
    const scale = ['16-30', '31-100', '100+'].includes(answers['19']);
    const partnershipNeed = needs.includes('curriculum') || needs.includes('licensing');
    const urgency = ['immediate', 'this-term'].includes(answers['20']);
    const score = (decisionMaker ? 3 : 1) + (scale ? 2 : 0) + (partnershipNeed ? 2 : 0) + (urgency ? 2 : 0) + (contact.line ? 1 : 0) + (contact.school ? 1 : 0);
    const priority = score >= 8 ? 'HOT' : score >= 5 ? 'WARM' : 'NURTURE';
    const isSchoolLead = decisionMaker || scale || partnershipNeed;
    return {
      priority,
      score,
      summary: `${isSchoolLead ? 'School or learning-center partnership' : 'Teacher training'} lead${contact.school ? ` · ${contact.school}` : ''}${teacherType ? ` · ${teacherType}` : ''}${ages ? ` · Ages: ${ages}` : ''}${students ? ` · Students: ${students}` : ''}${timeline ? ` · Timeline: ${timeline}` : ''}${contact.line ? ' · LINE captured' : ''}`,
      salesAngle: isSchoolLead
        ? `Position ${match.title || 'Engbrain Teacher Partnership'} around curriculum licensing, teacher training, printable student packs, and implementation support for classrooms or centers.`
        : `Position ${match.title || 'Engbrain Teacher Partnership'} as KruBow’s practical teacher training path: phonics confidence, lesson scripts, worksheets, and classroom-ready activities.`,
      nextAction: priority === 'HOT'
        ? 'Contact quickly. Confirm whether they are the decision-maker, number of students/classes, and send partnership/licensing options.'
        : 'Send partnership info, ask what ages/classes they teach, then qualify whether this is an individual teacher or school decision-maker.',
      followUp: `Hi ${contact.name || 'there'}, thanks for completing the Engbrain quiz. KruBow recommends the ${match.title || 'Engbrain Teacher Partnership'} path${contact.school ? ` for ${contact.school}` : ''}. It can help with ${needLabels.length ? needLabels.join(', ').toLowerCase() : 'phonics curriculum, teacher training, and classroom materials'}. Could you share how many classes or students you want to support?`,
    };
  }

  let score = 0;
  const reasons = [];

  if (answers['7'] === 'now') { score += 3; reasons.push('Ready now'); }
  else if (answers['7'] === 'month') { score += 2; reasons.push('Wants help within 1 month'); }
  else if (answers['7'] === '3month') { score += 1; reasons.push('Planning within 3 months'); }

  if (answers['8'] === '1on1') { score += 2; reasons.push('Prefers 1:1 Private'); }
  else if (answers['8'] === 'group') { score += 1; reasons.push('Open to group Zoom'); }

  if (['3-6k', '6-9k', '9k+'].includes(answers['9'])) { score += 2; reasons.push(`Budget ${LABELS.budget[answers['9']]}`); }
  else if (answers['9'] === '1-3k') { score += 1; reasons.push('Budget ฿1,000–3,000'); }

  if (goalLabels.length) { score += 1; reasons.push(`Goal: ${goalLabels.join(', ')}`); }
  if (contact.line) { score += 1; reasons.push('LINE captured'); }

  const priority = score >= 7 ? 'HOT' : score >= 4 ? 'WARM' : 'NURTURE';
  const childLine = child.name ? `${child.name}${child.age ? `, age ${child.age}` : ''}${child.grade ? `, ${LABELS.grade[child.grade] || child.grade}` : ''}` : 'their child';
  const course = match.title || 'the recommended course';

  let salesAngle = `Use the quiz result as the opener: ${course} was recommended based on ${childLine}.`;
  if (goals.includes('reading') || answers['4'] || answers['5']) {
    salesAngle = `Lead with phonics foundation and reading confidence. ${course} was recommended based on ${childLine} and their quiz answers.`;
  } else if (goals.includes('speak')) {
    salesAngle = `Lead with speaking confidence and practical English. ${course} was recommended based on their quiz answers.`;
  }

  const nextAction = priority === 'HOT'
    ? 'Message or call quickly. Confirm the quiz result, recommend the class, and offer the next enrollment step.'
    : priority === 'WARM'
      ? 'Send a helpful explanation of the result, ask one confirming question, then invite them to the best next class.'
      : 'Use a low-pressure follow-up. Give the result, share why it fits, and invite them to ask KruBow for guidance.';

  const followUp = `Hi ${contact.name || 'there'}, thanks for completing the Engbrain quiz. Based on ${child.name ? `${child.name}'s` : 'your'} answers, KruBow recommends ${course}. The main reason is ${goalLabels.length ? goalLabels.join(', ').toLowerCase() : 'the current English level and learning goal'}. Would you like KruBow to confirm the best class and schedule for you?`;

  return {
    priority,
    score,
    summary: reasons.join(' · ') || 'Basic contact captured',
    salesAngle,
    nextAction,
    followUp,
  };
}

const THAI = {
  persona: { parent: 'ผู้ปกครอง (หาคอร์สให้ลูก)', mom: 'คุณแม่ (พัฒนาอังกฤษของตัวเอง)', teacher: 'ครู/โรงเรียน' },
  grade: LABELS.grade,
  goal: { reading:'การอ่านเชิงวิชาการ', speak:'การพูด', 'ep-exam':'สอบ EP', inter:'เตรียมอนาคตสายอินเตอร์', confidence:'ความมั่นใจ' },
  format: { '1on1':'เรียนตัวต่อตัว 1:1', group:'กลุ่ม Zoom', video:'คอร์สวิดีโอ', books:'หนังสือ/สื่อฝึกเอง', unsure:'ยังไม่แน่ใจ' },
  budget: LABELS.budget,
  timeline: { now:'พร้อมเริ่มทันที', month:'ภายใน 1 เดือน', '3month':'ภายใน 3 เดือน', research:'กำลังศึกษาข้อมูล' },
  az: { confident:'รู้ A-Z ค่อนข้างมั่นใจ', some:'รู้บ้าง', no:'ยังไม่ค่อยได้', unsure:'ไม่แน่ใจ' },
  jolly: { done:'เคยเรียน Jolly Phonics แล้ว', some:'เคยเรียนบ้าง', no:'ยังไม่เคยเรียน', unsure:'ไม่แน่ใจ' },
  momFear: { pronunciation:'กลัวออกเสียงผิด', vocabulary:'คำศัพท์ไม่พอ', mistakes:'กลัวลูกจำผิด', shy:'เขิน/ไม่มั่นใจ', daily:'ไม่รู้จะพูดอะไรกับลูกทุกวัน' },
  momSounds: { yes:'รู้และมั่นใจ', some:'รู้บ้างบางเสียง', no:'ยังไม่เคยเรียนจริงจัง', 'not-sure':'ไม่แน่ใจว่า 44 sounds คืออะไร' },
  momDaily: { none:'ยังไม่มีภาษาอังกฤษทุกวัน', 'few-words':'พูดได้ไม่กี่คำ', '5-10':'วันละ 5–10 นาที', '10-plus':'มากกว่า 10 นาที', inconsistent:'พยายามอยู่แต่ยังไม่สม่ำเสมอ' },
  momBlocker: { confidence:'ไม่มั่นใจ', what:'ไม่รู้จะสอนอะไร', pronounce:'ติดเรื่องการออกเสียง', child:'ลูกไม่ค่อยสนุก', teacher:'คิดว่าโรงเรียน/ครูควรจัดการ' },
  momFit: { 'yes-self':'อยากพัฒนาตัวเองด้วย', 'yes-guidance':'อยากได้คนไกด์', simple:'สนใจถ้าทำตามง่าย', no:'อยากให้ครูสอนมากกว่า' },
  teacherType: { teacher:'ครูรายบุคคล', owner:'เจ้าของโรงเรียน/ศูนย์', coordinator:'หัวหน้าครู/ฝ่ายวิชาการ', tutor:'ติวเตอร์/เจ้าของศูนย์', homeschool:'ผู้ปกครอง/ครูโฮมสคูล' },
  teacherAges: { kindergarten:'อนุบาล', 'g1-g3':'ประถม G1–G3', 'g4-g6':'ประถม G4–G6', mixed:'หลายช่วงอายุ', adults:'ผู้ใหญ่/อบรมครู' },
  teacherNeed: { curriculum:'หลักสูตร Phonics', training:'อบรมครู', worksheets:'ชุดใบงาน/แพ็กนักเรียน', 'lesson-plans':'แผนการสอน/สคริปต์สอน', pronunciation:'พัฒนาการออกเสียงของครู', licensing:'ไลเซนส์/พาร์ตเนอร์' },
  teacherStudents: LABELS.teacherStudents,
  teacherTimeline: { immediate:'ต้องการทันที', 'this-term':'ใช้เทอมนี้', 'next-term':'ใช้เทอมหน้า', research:'กำลังศึกษาข้อมูล' },
};

function t(table, key, fallback = 'ไม่ระบุ') {
  return THAI[table]?.[key] || LABELS[table]?.[key] || key || fallback;
}

function ThaiList(items, table) {
  return items.map((item) => t(table, item)).filter(Boolean).join(', ') || 'ไม่ระบุ';
}

function buildThaiSummary(lead, qualification) {
  const answers = lead.answers || {};
  const contact = answers['10'] || {};
  if (lead.path === 'mom') {
    return [
      'ลีด SmartMom',
      contact.childAge ? `อายุลูก ${contact.childAge}` : '',
      answers['11'] ? `กังวล: ${t('momFear', answers['11'])}` : '',
      answers['13'] ? `อังกฤษในบ้าน: ${t('momDaily', answers['13'])}` : '',
      answers['12'] ? `44 sounds: ${t('momSounds', answers['12'])}` : '',
      contact.line ? 'มี LINE แล้ว' : '',
    ].filter(Boolean).join(' · ');
  }
  if (lead.path === 'teacher') {
    const isSchoolLead = ['owner', 'coordinator', 'tutor'].includes(answers['16']) || ['16-30', '31-100', '100+'].includes(answers['19']) || (Array.isArray(answers['18']) && (answers['18'].includes('curriculum') || answers['18'].includes('licensing')));
    return [
      isSchoolLead ? 'ลีดโรงเรียน/ศูนย์/พาร์ตเนอร์' : 'ลีดอบรมครู',
      contact.school || '',
      answers['16'] ? t('teacherType', answers['16']) : '',
      answers['17'] ? `ช่วงวัย: ${t('teacherAges', answers['17'])}` : '',
      answers['19'] ? `นักเรียน ${t('teacherStudents', answers['19'])}` : '',
      answers['20'] ? `เวลาเริ่ม: ${t('teacherTimeline', answers['20'])}` : '',
      contact.line ? 'มี LINE แล้ว' : '',
    ].filter(Boolean).join(' · ');
  }
  const goals = Array.isArray(answers['6']) ? answers['6'] : [];
  return [
    answers['7'] ? t('timeline', answers['7']) : '',
    answers['8'] ? t('format', answers['8']) : '',
    answers['9'] ? `งบ ${t('budget', answers['9'])}` : '',
    goals.length ? `เป้าหมาย: ${ThaiList(goals, 'goal')}` : '',
    contact.line ? 'มี LINE แล้ว' : '',
  ].filter(Boolean).join(' · ') || qualification.summary;
}

function buildThaiSalesAngle(lead) {
  const answers = lead.answers || {};
  const match = lead.match || {};
  const course = match.title || 'คอร์สที่ระบบแนะนำ';
  if (lead.path === 'mom') {
    return `เสนอ SmartMom เป็นทางลัดให้คุณแม่ไทยฝึก 44 sounds และเริ่มพูดอังกฤษกับลูกได้มั่นใจขึ้น โดยเริ่มจากปัญหาหลักของเขา: ${t('momBlocker', answers['14'])}`;
  }
  if (lead.path === 'teacher') {
    const needs = Array.isArray(answers['18']) ? answers['18'] : [];
    return `นำเสนอ ${course} ให้ตอบโจทย์ ${ThaiList(needs, 'teacherNeed')} พร้อมอธิบายเรื่องหลักสูตร สื่อการสอน และการซัพพอร์ตการนำไปใช้จริง`;
  }
  const child = answers['2'] || {};
  const childLine = child.name ? `${child.name}${child.age ? ` อายุ ${child.age}` : ''}${child.grade ? ` ${t('grade', child.grade)}` : ''}` : 'ลูกของผู้ปกครอง';
  return `เปิดบทสนทนาด้วยผลแบบทดสอบ: ระบบแนะนำ ${course} จากคำตอบของ ${childLine} ให้เน้นพื้นฐาน phonics การอ่าน และความมั่นใจของเด็ก`;
}

function buildThaiNextAction(lead, qualification) {
  if (lead.path === 'mom') return 'รีบทักกลับ ยืนยันคูปอง SMARTMOM15 ส่วนลด 15% ภายใน 24 ชั่วโมง และส่งรายละเอียดคอร์ส SmartMom ราคา ฿3,990';
  if (lead.path === 'teacher') return qualification.priority === 'HOT'
    ? 'รีบติดต่อเพื่อถามว่าเป็นผู้ตัดสินใจหรือไม่ จำนวนห้อง/นักเรียน และส่งตัวเลือกพาร์ตเนอร์หรือไลเซนส์'
    : 'ส่งข้อมูลพาร์ตเนอร์ ถามช่วงอายุ/จำนวนคลาส แล้วคัดกรองว่าเป็นครูรายบุคคลหรือผู้ตัดสินใจของโรงเรียน';
  return qualification.priority === 'HOT'
    ? 'รีบทักหรือโทรทันที ยืนยันผลแบบทดสอบ แนะนำคอร์ส และปิดขั้นตอนสมัครเรียนถัดไป'
    : qualification.priority === 'WARM'
      ? 'ส่งคำอธิบายผลแบบทดสอบแบบช่วยเหลือ ถามคำถามยืนยัน 1 ข้อ แล้วชวนเข้าสู่คลาสที่เหมาะที่สุด'
      : 'ติดตามแบบไม่กดดัน ส่งผลลัพธ์และเหตุผลว่าทำไมคอร์สนี้เหมาะ แล้วชวนถามครูโบว์เพิ่มเติม';
}

function buildThaiFollowUp(lead) {
  const answers = lead.answers || {};
  const contact = answers['10'] || {};
  const match = lead.match || {};
  const course = match.title || 'คอร์สที่เหมาะสม';
  if (lead.path === 'mom') {
    return `สวัสดีค่ะคุณ${contact.name || 'แม่'} ขอบคุณที่ทำแบบทดสอบ Engbrain นะคะ จากคำตอบ ครูโบว์แนะนำ SmartMom ค่ะ ตอนนี้ใช้โค้ด SMARTMOM15 รับส่วนลด 15% ได้ภายใน 24 ชั่วโมง คอร์สนี้ช่วยให้คุณแม่ฝึก 44 sounds และเริ่มเป็นครูภาษาอังกฤษคนแรกของลูกได้อย่างมั่นใจ ต้องการให้ส่งรายละเอียดให้เลยไหมคะ`;
  }
  if (lead.path === 'teacher') {
    const needs = Array.isArray(answers['18']) ? answers['18'] : [];
    return `สวัสดีค่ะคุณ${contact.name || 'ครู'} ขอบคุณที่ทำแบบทดสอบ Engbrain นะคะ จากคำตอบ ครูโบว์แนะนำแนวทาง ${course}${contact.school ? ` สำหรับ ${contact.school}` : ''} ซึ่งช่วยเรื่อง ${ThaiList(needs, 'teacherNeed')} ได้ค่ะ รบกวนแจ้งจำนวนห้องหรือจำนวนนักเรียนที่ต้องการดูแลเพิ่มเติมได้ไหมคะ`;
  }
  const child = answers['2'] || {};
  const goals = Array.isArray(answers['6']) ? answers['6'] : [];
  return `สวัสดีค่ะคุณ${contact.name || 'ผู้ปกครอง'} ขอบคุณที่ทำแบบทดสอบ Engbrain นะคะ จากคำตอบของ${child.name ? `น้อง${child.name}` : 'ลูก'} ครูโบว์แนะนำ ${course} ค่ะ เหตุผลหลักคือ ${goals.length ? ThaiList(goals, 'goal') : 'ระดับภาษาอังกฤษและเป้าหมายการเรียนตอนนี้'} ต้องการให้ครูโบว์ช่วยคอนเฟิร์มคลาสและตารางเรียนที่เหมาะที่สุดให้ไหมคะ`;
}

export function buildTelegramMessage(lead) {
  const answers = lead.answers || {};
  const path = lead.path || 'parent';
  const match = lead.match || {};
  const contact = answers['10'] || {};
  const qualification = lead.qualification || buildSalesQualification(lead);

  let msg = `🎓 ลีดใหม่จากแบบทดสอบ Engbrain\n\n` +
    `🔥 ความสำคัญ: ${qualification.priority} (${qualification.score}/9)\n` +
    `🧭 สรุปลีด: ${buildThaiSummary({ ...lead, path, answers }, qualification)}\n\n` +
    `👤 ชื่อลูกค้า: ${contact.name || 'ไม่ระบุ'}\n` +
    `📞 เบอร์โทร: ${contact.phone || 'ไม่ระบุ'}\n` +
    `💚 LINE: ${contact.line || 'ไม่ระบุ'}\n` +
    `🙋 ประเภทลูกค้า: ${t('persona', path, path)}\n`;

  if (path === 'parent') {
    const child = answers['2'] || {};
    const goals = Array.isArray(answers['6']) ? answers['6'] : [];
    msg +=
      `\n👶 ข้อมูลเด็ก: ${child.name || '?'} · อายุ ${child.age || '?'} · ${t('grade', child.grade, '?')}\n` +
      `🔤 รู้ A-Z: ${t('az', answers['4'])}\n` +
      (answers['5'] ? `📗 Jolly Phonics: ${t('jolly', answers['5'])}\n` : '') +
      `🎯 เป้าหมาย: ${ThaiList(goals, 'goal')}\n` +
      `⏰ ระยะเวลาที่อยากเริ่ม: ${t('timeline', answers['7'])}\n` +
      `💻 รูปแบบที่สนใจ: ${t('format', answers['8'])}\n` +
      `💰 งบประมาณ: ${t('budget', answers['9'])}\n`;
  } else if (path === 'mom') {
    msg +=
      `\n👶 อายุลูก: ${contact.childAge || 'ไม่ระบุ'}\n` +
      `😟 ความกังวล: ${t('momFear', answers['11'])}\n` +
      `🔤 ความเข้าใจ 44 sounds: ${t('momSounds', answers['12'])}\n` +
      `🗣 ภาษาอังกฤษในบ้านตอนนี้: ${t('momDaily', answers['13'])}\n` +
      `🧱 อุปสรรคหลัก: ${t('momBlocker', answers['14'])}\n` +
      `✅ ความพร้อมเรียนของคุณแม่: ${t('momFit', answers['15'])}\n` +
      `🎟 คูปอง: SMARTMOM15 · ลด 15% · ใช้ได้ภายใน 24 ชั่วโมง\n`;
  } else if (path === 'teacher') {
    const needs = Array.isArray(answers['18']) ? answers['18'] : [];
    msg +=
      `\n🏫 โรงเรียน/ศูนย์: ${contact.school || 'ไม่ระบุ'}\n` +
      `🪪 ตำแหน่ง: ${contact.role || 'ไม่ระบุ'}\n` +
      `👩‍🏫 ประเภทครู: ${t('teacherType', answers['16'])}\n` +
      `👧 ช่วงวัย/คลาส: ${t('teacherAges', answers['17'])}\n` +
      `🧰 ต้องการ: ${ThaiList(needs, 'teacherNeed')}\n` +
      `👥 จำนวนนักเรียน: ${t('teacherStudents', answers['19'])}\n` +
      `⏰ ระยะเวลาที่อยากเริ่ม: ${t('teacherTimeline', answers['20'])}\n`;
  }

  msg += `\n📚 คอร์สที่แนะนำ: ${match.title || 'ไม่ระบุ'}\n\n` +
    `💬 มุมขาย: ${buildThaiSalesAngle({ ...lead, path, answers })}\n` +
    `✅ สิ่งที่ควรทำต่อ: ${buildThaiNextAction({ ...lead, path, answers }, qualification)}\n\n` +
    `✉️ ข้อความแนะนำให้เซลส์ส่ง:\n${buildThaiFollowUp({ ...lead, path, answers })}`;
  return msg;
}

function getClientIp(request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

async function checkRateLimit(request, env, deps) {
  if (!env.LEADS_KV) return { ok: true };
  const ip = getClientIp(request);
  const now = deps.now?.() ?? Date.now();
  const bucket = Math.floor(now / (RATE_LIMIT_WINDOW_SECONDS * 1000));
  const key = `rate:${ip}:${bucket}`;
  const count = Number(await env.LEADS_KV.get(key)) || 0;
  if (count >= RATE_LIMIT_MAX_SUBMISSIONS) return { ok: false };
  await env.LEADS_KV.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS + 60 });
  return { ok: true };
}

async function readJsonPayload(request) {
  const len = Number(request.headers.get('content-length') || '0');
  if (len > MAX_JSON_BYTES) throw new Error('Payload too large.');
  return request.json();
}

async function storeLead(lead, env, deps) {
  if (!env.LEADS_KV) return;
  const now = deps.now?.() ?? Date.now();
  const uuid = deps.randomUUID?.() || crypto.randomUUID();
  await env.LEADS_KV.put(`lead:${now}:${uuid}`, JSON.stringify(lead), {
    metadata: {
      source: lead.source,
      path: lead.path,
      match: lead.match?.title,
      receivedAt: lead.receivedAt,
    },
  });
}

async function sendTelegram(lead, env, deps) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return { skipped: true };
  const fetchImpl = deps.fetch || fetch;
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: buildTelegramMessage(lead),
      disable_web_page_preview: true,
    }),
  });
  if (!response.ok) throw new Error(`Telegram returned ${response.status}`);
  return { ok: true };
}

export async function handleLeadRequest(request, env = {}, deps = {}) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405);

  const rate = await checkRateLimit(request, env, deps);
  if (!rate.ok) return json({ ok: false, error: 'Too many submissions. Please try again later.' }, 429);

  let payload;
  try {
    payload = await readJsonPayload(request);
  } catch {
    return json({ ok: false, error: 'Invalid JSON payload.' }, 400);
  }

  const lead = normalizeLead(payload, deps);
  const validationError = validateLead(lead);
  if (validationError) return json({ ok: false, error: validationError }, 400);
  lead.qualification = buildSalesQualification(lead);

  try {
    await storeLead(lead, env, deps);
    await sendTelegram(lead, env, deps);
  } catch (err) {
    console.error('Lead handling failed', err);
    return json({ ok: false, error: 'Lead received but notification failed.' }, 502);
  }

  return json({ ok: true });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/lead') {
      return handleLeadRequest(request, env, { waitUntil: ctx?.waitUntil?.bind(ctx) });
    }
    return env.ASSETS.fetch(request);
  },
};
