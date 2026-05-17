// Loading + results screens

function BuildingProfile({ onDone }){
  const items = [
    'กำลังอ่านคำตอบของคุณ',
    'กำลังดูอายุและระดับชั้นของลูก',
    'กำลังประเมินหลักสูตรโรงเรียนที่เหมาะ',
    'กำลังวิเคราะห์ระดับภาษาอังกฤษ',
    'กำลังจับคู่กับเป้าหมายการเรียน',
    'กำลังหาคอร์สที่เหมาะที่สุด…',
  ];
  const [done, setDone] = React.useState(0);
  React.useEffect(() => {
    if (done >= items.length) { const t = setTimeout(onDone, 650); return () => clearTimeout(t); }
    const t = setTimeout(() => setDone(d => d+1), done===0 ? 500 : 600);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <div style={{minHeight:'80vh', display:'flex', flexDirection:'column', justifyContent:'center', padding:'20px 4px'}}>
      <div className="card" style={{padding:'28px 24px 24px'}}>
        <div style={{display:'flex', justifyContent:'center', marginBottom:18}}>
          <CoachAvatar size={72} tone="warm"/>
        </div>
        <div className="serif" style={{textAlign:'center', fontSize:24, fontWeight:500, letterSpacing:'-0.01em', lineHeight:1.2}}>
          ครูโบว์กำลังสร้างโปรไฟล์ของคุณ…
        </div>
        <div className="muted" style={{textAlign:'center', fontSize:13, marginTop:6}}>
          กำลังจับคู่คำตอบกับคอร์สที่เหมาะที่สุดอย่างละเอียดค่ะ
        </div>
        <div style={{height:22}}/>
        <div style={{display:'grid', gap:10}}>
          {items.map((txt,i) => {
            const isDone = i < done;
            const isActive = i === done;
            return (
              <div key={txt} style={{
                display:'grid', gridTemplateColumns:'28px 1fr', gap:12, alignItems:'center',
                padding:'12px 14px', borderRadius:14,
                background: isActive ? 'var(--coral-soft)' : isDone ? 'var(--mint-soft)' : 'var(--bg-2)',
                opacity: i>done ? .4 : 1,
                transition:'all .3s ease',
                transform: isActive?'translateX(2px)':'none',
              }}>
                <div style={{
                  width:24, height:24, borderRadius:99,
                  background: isDone?'var(--mint-ink)':isActive?'var(--coral)':'var(--line-2)',
                  display:'grid', placeItems:'center', color:'#fff', fontWeight:800, fontSize:13,
                }}>
                  {isDone ? '✓' : isActive ? <Spinner/> : ''}
                </div>
                <div style={{fontSize:14, fontWeight:600, color: isDone?'var(--mint-ink)':'var(--ink)'}}>{txt}</div>
              </div>
            );
          })}
        </div>
      </div>
      <FooterLine/>
    </div>
  );
}

function Spinner(){
  return (
    <div style={{
      width:10, height:10, border:'2px solid #fff', borderRightColor:'transparent',
      borderRadius:99, animation:'spin .7s linear infinite'
    }}/>
  );
}

function Results({ answers, path, onRestart }){
  const [confettiReady, setConfettiReady] = React.useState(false);
  React.useEffect(() => { setConfettiReady(true); }, []);

  const match = pickMatch(answers, path);
  const isMom = path === 'mom';
  const isTeacher = path === 'teacher';

  return (
    <div style={{position:'relative'}}>
      {confettiReady && <Confetti/>}

      <div className="card" style={{padding:0, overflow:'hidden', position:'relative', zIndex:2}}>
        <div style={{
          padding:'28px 22px 18px', textAlign:'center',
          background:'linear-gradient(180deg, var(--butter), transparent)',
          position:'relative',
        }}>
          <div style={{display:'flex', justifyContent:'center', gap:2, marginBottom:10}}>
            {[0,1,2,3,4].map(i => <span key={i} style={{fontSize:22, animation:`popIn .35s ease ${i*0.08}s both`}}>⭐</span>)}
          </div>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            background:'#fff', border:'1.5px solid var(--coral)', color:'var(--coral-ink)',
            padding:'7px 14px', borderRadius:999, fontSize:11, fontWeight:800, letterSpacing:'.14em',
          }}>
            ✦ พบคอร์สที่เหมาะกับคุณแล้ว
          </div>
          <div className="tiny muted" style={{marginTop:14}}>คำแนะนำจากครูโบว์สำหรับ {isTeacher ? 'เส้นทางการสอนของคุณ' : isMom ? 'คุณและลูกของคุณ' : (answers[2]?.name || 'ลูกของคุณ')}</div>
          <h1 className="serif" style={{
            margin:'8px 0 4px', fontSize:'clamp(28px, 7vw, 34px)', fontWeight:500,
            letterSpacing:'-0.02em', lineHeight:1.1, textWrap:'balance'
          }}>
            {match.title}
          </h1>
          <div style={{color:'var(--coral-ink)', fontWeight:700, fontSize:14}}>{match.tag}</div>
        </div>

        {/* course photo */}
        <div style={{padding:'0 22px'}}>
          {match.photo ? (
            <img
              src={match.photo}
              alt={`${match.title} ตัวอย่างคอร์ส`}
              style={{display:'block', width:'100%', aspectRatio:'16/9', objectFit:'cover', borderRadius:18, boxShadow:'var(--shadow-sm)'}}
            />
          ) : (
            <Photo tone="warm" ratio="16/9" rounded={18}
              label={`ภาพ: ${match.title} กำลังเรียนจริง ครูโบว์กับเด็กผ่าน Zoom`}
              hint="ตัวอย่างคอร์ส"/>
          )}
        </div>

        {/* about card */}
        <div style={{padding:'22px 22px 6px'}}>
          <div className="micro muted">เกี่ยวกับคอร์สนี้</div>

          {match.explain?.type === 'image' ? (
            <img
              src={match.explain.src}
              alt={`${match.title} — รายละเอียดในคอร์ส`}
              style={{display:'block', width:'100%', marginTop:10, borderRadius:16, boxShadow:'var(--shadow-sm)'}}
            />
          ) : match.explain?.type === 'bullets' ? (
            <ExplainBullets data={match.explain}/>
          ) : (
            <div style={{fontSize:15, lineHeight:1.55, marginTop:8, color:'var(--ink)'}}>
              {match.about}
            </div>
          )}

          {/* key facts */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16}}>
            {match.facts.map(f => (
              <div key={f.l} style={{
                padding:'12px 14px', borderRadius:12, background:'var(--bg-2)',
                border:'1px solid var(--line)',
              }}>
                <div className="tiny muted" style={{fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', fontSize:10}}>{f.l}</div>
                <div style={{fontSize:14, fontWeight:700, marginTop:4, color:'var(--ink)'}}>{f.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* social proof strip */}
        <div style={{margin:'22px 22px 0', padding:'14px 16px', borderRadius:14, background:'var(--mint-soft)', display:'grid', gridTemplateColumns:'36px 1fr', gap:12, alignItems:'center'}}>
          <div style={{fontSize:26}}>📈</div>
          <div style={{fontSize:13, lineHeight:1.45, color:'var(--mint-ink)'}}>
            {isTeacher ? (
              <><strong>Teacher Partnership เหมาะสำหรับครู โรงเรียน และสถาบัน</strong> ที่ต้องการระบบโฟนิกส์ชัดเจน พร้อมการอบรมและสื่อใช้ในห้องเรียน</>
            ) : isMom ? (
              <><strong>SmartMom เหมาะสำหรับคุณแม่ไทย</strong> ที่อยากเข้าใจ 44 เสียงภาษาอังกฤษ และเป็นครูภาษาอังกฤษคนแรกของลูก</>
            ) : (
              <><strong>87% ของผู้ปกครอง</strong> ที่เริ่มจากคอร์สนี้ เห็นพัฒนาการจริงภายใน <strong>3 เดือน</strong></>
            )}
          </div>
        </div>

        <div style={{padding:'22px 22px 24px'}}>
          {/* Discount reward banner */}
          <div style={{
            position:'relative', padding:'18px 18px 16px', borderRadius:20, marginBottom:16,
            background:'linear-gradient(135deg, oklch(0.95 0.1 85), oklch(0.88 0.14 55))',
            border:'2px dashed var(--coral)',
            textAlign:'center', overflow:'hidden',
          }}>
            <div style={{position:'absolute', top:-14, right:-14, fontSize:72, opacity:.15, transform:'rotate(18deg)'}}>🎁</div>
            <div className="micro" style={{color:'var(--coral-ink)', fontSize:10, letterSpacing:'.18em'}}>
              {isTeacher ? '✦ แนวทางความร่วมมือสำหรับครู ✦' : isMom ? '✦ คูปอง SmartMom ใช้ได้ภายใน 24 ชั่วโมง ✦' : '✦ รางวัลสำหรับผู้ทำแบบทดสอบครบ ✦'}
            </div>
            <div className="serif" style={{
              fontSize:'clamp(30px, 7vw, 38px)', fontWeight:600, marginTop:4,
              color:'var(--ink)', letterSpacing:'-0.02em', lineHeight:1.05,
            }}>
              <span style={{fontSize:'0.9em'}}>{isTeacher ? '🤝' : '🎁'}</span> {isTeacher ? 'ข้อมูลความร่วมมือ' : isMom ? 'ลด 15%' : 'ลด ฿500'}
            </div>
            <div style={{fontSize:13, color:'var(--ink-2)', marginTop:6, lineHeight:1.45, fontWeight:500}}>
              {isTeacher ? 'กรอกข้อมูลเพื่อให้ครูโบว์ส่งตัวเลือกอบรม สื่อการสอน หรือรูปแบบลิขสิทธิ์ที่เหมาะกับห้องเรียน โรงเรียน หรือศูนย์ของคุณ' : isMom ? 'ใช้โค้ด SMARTMOM15 ภายใน 24 ชั่วโมง ราคา SmartMom ปกติ ฿3,990' : 'สิทธิพิเศษสำหรับผู้ปกครองที่ทำแบบทดสอบครบ ทักครูโบว์ด้านล่างเพื่อรับสิทธิ์ค่ะ'}
            </div>
          </div>

          {/* Primary CTA — Messenger (big, unmistakably a button) */}
          <a href={CTA_HREFS.msg} target="_blank" rel="noopener noreferrer"
            className="claim-btn"
            style={{
              display:'block', width:'100%', padding:'22px 22px 20px', borderRadius:22,
              background:'linear-gradient(180deg, #3aa0ff 0%, #0084FF 55%, #0068dd 100%)',
              color:'#fff', textDecoration:'none', textAlign:'center',
              border:'1px solid rgba(255,255,255,.2)',
              boxShadow:'0 18px 36px rgba(0,132,255,.45), 0 4px 0 #004fa8, inset 0 1px 0 rgba(255,255,255,.4)',
              cursor:'pointer', position:'relative', overflow:'hidden',
            }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'5px 12px', borderRadius:999,
              background:'rgba(255,255,255,.22)',
              fontSize:10.5, fontWeight:800, letterSpacing:'.16em', marginBottom:10,
            }}>
              🎁 แตะเพื่อรับสิทธิ์
            </div>
            <div style={{
              fontSize:'clamp(22px, 5.2vw, 26px)', fontWeight:900,
              letterSpacing:'-0.01em', lineHeight:1.1,
            }}>
              {isTeacher ? 'รับข้อมูลความร่วมมือ' : isMom ? 'รับคูปอง SMARTMOM15' : 'รับส่วนลดของคุณ'}
            </div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              fontSize:14, fontWeight:700, opacity:.95, marginTop:8,
            }}>
              <svg width="18" height="18" viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
                <path d="M18 0C8.06 0 0 7.5 0 16.76c0 5.27 2.6 9.97 6.67 13.03v6.21l6.09-3.34c1.62.45 3.34.69 5.24.69 9.94 0 18-7.5 18-16.59C36 7.5 27.94 0 18 0zm1.79 22.32l-4.58-4.88-8.94 4.88L16.09 12l4.7 4.88L29.73 12l-9.94 10.32z"/>
              </svg>
              ทักเราทาง Messenger
              <span style={{fontSize:18, fontWeight:900, marginLeft:2}}>→</span>
            </div>
          </a>

          {/* Secondary options */}
          <div className="micro muted" style={{textAlign:'center', fontSize:10, margin:'18px 0 10px', letterSpacing:'.14em'}}>
            หรือติดต่อช่องทางอื่น
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <ContactCTA outline label="LINE" sub="@engbrain" icon="line"/>
            <ContactCTA outline label="โทร" sub="096-005-6150" icon="call"/>
          </div>
        </div>
      </div>

      <button
        className="btn btn-ghost"
        onClick={onRestart}
        style={{display:'block', margin:'18px auto 0', fontSize:13}}>
        ↺ ทำแบบทดสอบใหม่
      </button>

      <FooterLine/>
    </div>
  );
}

function ExplainBullets({ data }){
  return (
    <div style={{marginTop:10}}>
      {data.title && (
        <div style={{fontSize:15, fontWeight:800, color:'var(--ink)', marginBottom:10, lineHeight:1.4}}>
          {data.title}
        </div>
      )}
      <div style={{display:'grid', gap:14}}>
        {data.sections.map((sec, i) => (
          <div key={i} style={{
            padding: sec.header ? '14px 14px 12px' : '0',
            borderRadius: sec.header ? 12 : 0,
            background: sec.header ? 'var(--coral-soft)' : 'transparent',
            border: sec.header ? '1px dashed var(--coral)' : 'none',
          }}>
            {sec.header && (
              <div style={{fontSize:13, fontWeight:800, color:'var(--coral-ink)', marginBottom:8, letterSpacing:'.02em'}}>
                🎁 {sec.header}
              </div>
            )}
            <div style={{display:'grid', gap:8}}>
              {sec.items.map((it, j) => (
                <div key={j} style={{display:'grid', gridTemplateColumns:'22px 1fr', gap:10, alignItems:'start'}}>
                  <div style={{fontSize:15, lineHeight:1.5}}>{it.icon}</div>
                  <div style={{fontSize:14, lineHeight:1.55, color:'var(--ink)'}}>{it.text}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CTA_HREFS = {
  line: 'https://line.me/R/ti/p/%40engbrain',
  msg:  'https://m.me/2377290269217014',
  call: 'tel:0960056150',
};
function ContactCTA({ color, label, sub, icon, outline }){
  const bg = outline ? 'transparent' : color;
  const fg = outline ? 'var(--ink)' : '#fff';
  return (
    <a href={CTA_HREFS[icon]} target={icon==='call'?'_self':'_blank'} rel="noopener noreferrer" style={{
      width:'100%', borderRadius:16, padding:'14px 16px',
      background: bg, color: fg,
      border: outline ? '1.5px solid var(--line-2)' : 'none',
      display:'grid', gridTemplateColumns:'36px 1fr auto', gap:12, alignItems:'center',
      textAlign:'left', fontWeight:700, textDecoration:'none',
      boxShadow: outline ? 'none' : '0 6px 18px rgba(0,0,0,.1)',
    }}>
      <div style={{
        width:36, height:36, borderRadius:10,
        background: outline?'var(--bg-2)':'rgba(255,255,255,.2)',
        color: outline?'var(--ink)':'#fff',
        display:'grid', placeItems:'center', fontSize:16, fontWeight:800,
      }}>
        {icon==='line'&&'L'}{icon==='msg'&&'M'}{icon==='call'&&'☎'}
      </div>
      <div style={{minWidth:0}}>
        <div style={{fontSize:15, fontWeight:800}}>{label}</div>
        <div style={{fontSize:12, opacity:.8, marginTop:2, fontWeight:500}}>{sub}</div>
      </div>
      <div style={{opacity:.8}}>→</div>
    </a>
  );
}

const VIDEO_COURSE_EXPLAIN = {
  type: 'bullets',
  title: 'เนื้อหาในคอร์ส Jolly Phonics มีอะไรบ้าง',
  sections: [
    { items: [
      { icon:'✅', text:'60 คลิปวิดีโอ ฝึกตามกระบวนการตามหลักสูตรนานาชาติ สอนโดยครูโบว์และเจ้าของภาษา (ครูเจ้าของภาษา)' },
      { icon:'✅', text:'สอนลูกๆวางรูปปาก 44 เสียงอย่างชัดเจน' },
      { icon:'✅', text:'ผสมเสียงอ่านคำศัพท์แบบโฟนิกส์ 1,200 คำครบจบหลักสูตร แบบไม่ต้องท่องจำ ภายใน 7–16 สัปดาห์' },
      { icon:'✅', text:'สอนและพาทำตามหนังสือทุกหน้า ใช้หนังสือครบจบทุกเล่ม 6 รายการ เทียบเท่ากับเรียนในระบบหลักสูตรอินเตอร์ 3 ปี แต่สามารถเรียนหลักสูตรครูโบว์จบได้ภายใน 1 เทอม' },
    ]},
    { items: [
      { icon:'💛', text:'มีครูโบว์ช่วยไกด์ ตรวจการบ้านดูรูปปากมากกว่า 42 ครั้ง' },
      { icon:'❤️', text:'เรียนได้ 2 คน แม่คู่ลูก หรือพี่คู่น้อง ดูแลให้ 2 คน' },
    ]},
    { items: [
      { icon:'✅', text:'มีใบประกาศนียบัตรให้เมื่อจบหลักสูตร' },
      { icon:'✅', text:'สามารถชมวิดิโอ หรือเรียนย้อนหลังได้ 2 ปี' },
    ]},
    { header: 'แถมฟรี', items: [
      { icon:'✅', text:'ไฟล์แฟลชการ์ด 1,200 คำ (pdf) พร้อมความหมายภาษาไทย' },
      { icon:'✅', text:'ไฟล์เสียงอ่านสะกดแบบโฟนิกส์ 1,200 คำ ตามเล่ม Jolly Wordbook ฟังได้ทุกที่ทุกเวลา' },
    ]},
  ],
};

function pickMatch(answers, path){
  if (path === 'teacher') return {
    title: 'Teacher Partnership จาก Engbrain',
    tag:   'อบรมครู + ลิขสิทธิ์หลักสูตร',
    about: 'นำระบบโฟนิกส์ของครูโบว์ไปใช้ในห้องเรียน โรงเรียน หรือสถาบันของคุณ แนวทางความร่วมมืออาจรวมอบรมครู สคริปต์การสอน ชุดเอกสารนักเรียน ลิขสิทธิ์หลักสูตร และการซัพพอร์ตการนำไปใช้จริง',
    facts: [{l:'เหมาะสำหรับ', v:'ครู · โรงเรียน'}, {l:'รวม', v:'อบรม + สื่อการสอน'}, {l:'ขนาดการใช้', v:'ห้องเรียนหรือโรงเรียน'}, {l:'ซัพพอร์ต', v:'การนำไปใช้จริง'}],
    photo: null, // TBD — teacher photo pending
    explain: {
      type: 'bullets',
      title: 'Teacher Partnership อาจรวมสิ่งเหล่านี้',
      sections: [
        { items: [
          { icon:'✅', text:'อบรมครูให้สอนโฟนิกส์ได้อย่างมั่นใจและถูกต้อง' },
          { icon:'✅', text:'โครงสร้างหลักสูตรสำหรับอนุบาลหรือประถม' },
          { icon:'✅', text:'ใบงานพิมพ์ได้ ชุดเอกสารนักเรียน แผนการสอน และสคริปต์' },
          { icon:'🤝', text:'ตัวเลือกลิขสิทธิ์หรือความร่วมมือสำหรับโรงเรียน/สถาบันที่ต้องการใช้ในวงกว้าง' },
        ]},
      ],
    },
  };
  if (path === 'mom') return {
    title: 'SmartMom',
    tag:   'สำหรับคุณแม่ไทยที่อยากสอนภาษาอังกฤษลูกที่บ้าน',
    about: 'SmartMom ช่วยให้คุณแม่ไทยเข้าใจและออกเสียง 44 เสียงภาษาอังกฤษได้เหมือนครู เพิ่มความมั่นใจในการออกเสียง และเป็นครูภาษาอังกฤษคนแรกของลูกผ่านการฝึกง่าย ๆ ที่บ้านทุกวัน',
    facts: [{l:'ราคา', v:'฿3,990'}, {l:'คูปอง', v:'SMARTMOM15'}, {l:'เหมาะสำหรับ', v:'คุณแม่ไทย'}, {l:'เป้าหมาย', v:'44 เสียง'}],
    photo: null, // TBD — mom photo pending
    explain: {
      type: 'bullets',
      title: 'SmartMom ช่วยให้คุณทำอะไรได้บ้าง',
      sections: [
        { items: [
          { icon:'✅', text:'เข้าใจและออกเสียง 44 เสียงภาษาอังกฤษได้ชัดเจนเหมือนครู' },
          { icon:'✅', text:'พูดภาษาอังกฤษกับลูกได้มากขึ้นทุกวันอย่างมั่นใจ' },
          { icon:'✅', text:'รู้ว่าควรสอนอะไรที่บ้าน ไม่ต้องพึ่งโรงเรียนอย่างเดียว' },
          { icon:'🎁', text:'รับส่วนลด 15% ด้วยคูปอง SMARTMOM15 เมื่อสมัครภายใน 24 ชั่วโมง' },
        ]},
      ],
    },
  };
  const a4 = answers[4], a5 = answers[5], a8 = answers[8], a9 = answers[9];
  let title = 'Jolly Phonics ระดับ 1', tag = 'คอร์สพื้นฐาน', about = 'เรียนเสียงภาษาอังกฤษ 42 เสียงผ่านเพลง ท่าทาง และเรื่องราว ครอบคลุมการผสมเสียง tricky words และการอ่านเบื้องต้น เหมาะสำหรับเด็กไทยที่เริ่มเรียนโฟนิกส์', facts = [{l:'รูปแบบ', v:'1:1 / กลุ่ม'}, {l:'จำนวนครั้ง', v:'2 ครั้ง/สัปดาห์'}, {l:'ระดับ', v:'เริ่มต้น'}, {l:'ระยะเวลา', v:'12 สัปดาห์'}], photo = 'assets/result-jp-level-1.jpg', explain = { type:'image', src:'assets/explain-jp-level-1.jpg' };
  if (a4 === 'confident' && a5 === 'done') {
    title = 'Jolly Phonics ระดับ 2';
    tag = 'สำหรับเด็กที่อ่านมั่นใจและพร้อมไปต่อ';
    about = 'ทบทวน 42 เสียง พร้อมเพิ่มคำศัพท์โฟนิกส์ 800–1,200 คำ tricky words ขั้นสูง และการสร้างประโยค เหมาะกับเด็กที่เรียน Jolly Phonics ระดับ 1 จบแล้ว';
    facts = [{l:'รูปแบบ', v:'1:1 / กลุ่ม'}, {l:'จำนวนครั้ง', v:'2 ครั้ง/สัปดาห์'}, {l:'ระดับ', v:'ระดับกลาง'}, {l:'ระยะเวลา', v:'16 สัปดาห์'}];
    photo = 'assets/result-jp-level-2.jpg';
    explain = { type:'image', src:'assets/explain-jp-level-2.jpg' };
  } else if (a4 === 'confident') {
    title = 'Jolly Phonics ระดับ 1+ Bridge';
    tag = 'เติมช่องว่าง แล้วไปต่อได้อย่างมั่นใจ';
    about = 'Level 1 แบบเร่งสำหรับเด็กที่รู้ A–Z แล้ว ครอบคลุมเสียงเพิ่มเติม 16 เสียง เช่น sh, ch, th และ digraphs พร้อมฝึกผสมเสียงใน 6 สัปดาห์ก่อนต่อระดับ 2';
    photo = 'assets/result-jp-level-1.jpg';
    explain = { type:'image', src:'assets/explain-jp-level-1.jpg' };
  }
  if (a9 === '9k+') {
    title = 'Engbrain VIP Phonics Flagship';
    tag = 'เรียน 1:1 กับครูโบว์ · ปรับเฉพาะตัวเต็มรูปแบบ';
    about = 'โปรแกรม 1:1 ที่ปรับเฉพาะลูกของคุณกับครูโบว์ ทุกบทเรียนปรับตามจังหวะ ความสนใจ และเป้าหมายของลูก รวม Oxford Discover การอ่านเข้มข้น แกรมมาร์ และช่องทาง WhatsApp ส่วนตัวกับครูโบว์เพื่อซัพพอร์ตการบ้าน';
    facts = [{l:'รูปแบบ', v:'ส่วนตัว 1:1'}, {l:'จำนวนครั้ง', v:'2–3 ครั้ง/สัปดาห์'}, {l:'ระดับ', v:'ปรับเฉพาะตัว'}, {l:'ระยะเวลา', v:'ยืดหยุ่น'}];
    photo = 'assets/result-vip-flagship.jpg';
    explain = null;
  } else if (a9 === '<1k') {
    title = 'คอร์สวิดีโอโฟนิกส์ เรียนเองตามเวลา';
    tag = 'มีครูโบว์อยู่กับคุณทุกที่';
    about = null;
    facts = [{l:'รูปแบบ', v:'วิดีโอเรียนเอง'}, {l:'จำนวนครั้ง', v:'60 คลิป'}, {l:'ระดับ', v:'เริ่มต้น → ขั้นสูง'}, {l:'ระยะเวลา', v:'7–16 สัปดาห์'}];
    photo = 'assets/result-video-course.jpg';
    explain = VIDEO_COURSE_EXPLAIN;
  } else if (a8 === 'group') {
    title = title + ' · กลุ่มเพื่อน';
  }
  return { title, tag, about, facts, photo, explain };
}

// ------ confetti ------
function Confetti(){
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * DPR;
      canvas.height = canvas.offsetHeight * DPR;
    };
    resize();
    const colors = ['#f08a5d', '#f9c74f', '#90be6d', '#a0c4ff', '#ff8fab'];
    const parts = Array.from({length: 90}).map(() => ({
      x: Math.random()*canvas.width,
      y: -Math.random()*canvas.height*0.4,
      vx: (Math.random()-0.5)*1.2*DPR,
      vy: (1 + Math.random()*2)*DPR,
      s: (6 + Math.random()*8)*DPR,
      r: Math.random()*Math.PI,
      vr: (Math.random()-0.5)*0.2,
      c: colors[Math.floor(Math.random()*colors.length)],
      shape: Math.random()<0.5 ? 'rect':'circle',
    }));
    let raf, t=0;
    const tick = () => {
      t++;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.03*DPR; p.r += p.vr;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random()*canvas.width; p.vy = (1+Math.random()*2)*DPR; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        if (p.shape==='rect') ctx.fillRect(-p.s/2, -p.s/4, p.s, p.s/2);
        else { ctx.beginPath(); ctx.arc(0,0,p.s/2.5,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
      });
      if (t < 240) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0,0,canvas.width,canvas.height);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{
    position:'fixed', inset:0, width:'100%', height:'100%',
    pointerEvents:'none', zIndex:1,
  }}/>;
}

if (!document.getElementById('result-keyframes')) {
  const s = document.createElement('style');
  s.id='result-keyframes';
  s.textContent = `@keyframes spin { to { transform: rotate(360deg);} }`;
  document.head.appendChild(s);
}

Object.assign(window, { BuildingProfile, Results });
