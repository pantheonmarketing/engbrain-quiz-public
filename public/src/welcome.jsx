// Welcome / landing screen
function Welcome({ onStart }){
  const layout = window.TWEAKS?.welcome || 'stacked';
  const hero = window.TWEAKS?.hero || 'portrait';

  return (
    <div style={{paddingBottom: 32}}>
      {layout === 'postcard' ? <PostcardHero hero={hero}/> : <StackedHero hero={hero}/>}

      <div style={{height: 22}}/>
      <SocialProof />

      <div style={{height: 24}}/>
      <button className="btn btn-coral" style={{width:'100%'}} onClick={onStart}>
        เริ่มทำแบบทดสอบ
        <span style={{display:'inline-block', transform:'translateX(2px)'}}>→</span>
      </button>

      <div style={{height: 10}}/>
      <div style={{textAlign:'center'}} className="muted tiny">
        ใช้เวลาประมาณ 2 นาที · รับคำแนะนำคอร์สที่เหมาะกับลูกฟรี
      </div>

      <StickyContactBar />
    </div>
  );
}

function BrandHeader(){
  return (
    <div className="between" style={{padding:'2px 4px'}}>
      <div className="row" style={{gap:10}}>
        <div style={{
          width:40, height:40, borderRadius:12, background:'var(--ink)',
          display:'grid', placeItems:'center', color:'#fffdf9',
          fontFamily:"'Noto Sans Thai', 'Plus Jakarta Sans', system-ui, sans-serif", fontWeight:600, fontSize:20,
          letterSpacing:'-0.02em', boxShadow:'var(--shadow-sm)',
        }}>E</div>
        <div>
          <div className="serif" style={{fontSize:18, fontWeight:600, letterSpacing:'-0.01em', lineHeight:1}}>Engbrain</div>
          <div className="tiny muted" style={{marginTop:2}}>Kids Phonics Academy</div>
        </div>
      </div>
    </div>
  );
}

function StackedHero({ hero }){
  return (
    <div style={{position:'relative'}}>
      {/* Big full-bleed hero image — native 16:9 course lineup */}
      <div style={{
        borderRadius:24, overflow:'hidden',
        boxShadow:'var(--shadow-lg)',
        border:'1px solid oklch(0.88 0.02 78 / .8)',
        position:'relative',
        background:'#f7d7e5',
      }}>
        <img
          src="assets/engbrain-hero.png"
          alt="คอร์สของ Engbrain: Jolly Phonics, Dino Phonics, Grammarian, Conversation และ Advanced Phonics"
          style={{display:'block', width:'100%', height:'auto'}}
        />
      </div>

      {/* Floating tag row BELOW the image so we don't cover the artwork */}
      <div style={{
        display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center',
        marginTop:14,
      }}>
        <FloatingTag color="var(--butter)" ink="var(--butter-ink)">
          <span style={{fontSize:14}}>✦</span> ผู้ปกครองพึงพอใจ 98%
        </FloatingTag>
        <FloatingTag color="var(--mint-soft)" ink="var(--mint-ink)">
          <span style={{fontSize:14}}>🎓</span> อนุบาล 1 – ม.3
        </FloatingTag>
        <FloatingTag color="var(--coral-soft)" ink="var(--coral-ink)">
          <span style={{fontSize:14}}>🇬🇧</span> เน้นโฟนิกส์เป็นพื้นฐาน
        </FloatingTag>
      </div>

      {/* Headline below hero */}
      <div style={{padding:'18px 4px 0', textAlign:'center'}}>
        <div className="micro" style={{color:'var(--coral-ink)'}}>Engbrain Kids Phonics Academy</div>
        <h1 className="serif" style={{
          margin:'8px 0 0', fontSize:'clamp(28px, 7vw, 36px)', lineHeight:1.08,
          fontWeight:500, letterSpacing:'-0.02em',
          textWrap:'balance', color:'var(--ink)',
        }}>
          ค้นหาคอร์สภาษาอังกฤษที่เหมาะกับลูกของคุณจริง ๆ
        </h1>
      </div>
    </div>
  );
}

function FloatingTag({ color, ink, children }){
  return (
    <div style={{
      background: color, color: ink,
      padding:'8px 12px', borderRadius:999,
      fontSize:12, fontWeight:700, letterSpacing:'.01em',
      display:'inline-flex', alignItems:'center', gap:6,
      boxShadow:'var(--shadow-sm)',
      backdropFilter:'blur(8px)',
    }}>{children}</div>
  );
}

function PostcardHero(){
  return (
    <div className="card" style={{padding:18}}>
      <Photo tone="warm" ratio="5/4" rounded={18}
        label="ภาพ: ครูโบว์สอนผ่าน Zoom เด็กยิ้ม มีแล็ปท็อปและแสงอบอุ่น"/>
      <div style={{padding:'18px 6px 4px'}}>
        <div className="micro" style={{color:'var(--coral-ink)'}}>วิธีสอนโฟนิกส์ของครูโบว์</div>
        <h1 className="serif" style={{
          margin:'6px 0 0', fontSize:34, lineHeight:1.05, fontWeight:500, letterSpacing:'-0.02em'
        }}>
          ค้นหาคอร์สภาษาอังกฤษที่เหมาะกับลูกของคุณจริง ๆ
        </h1>
      </div>
    </div>
  );
}

function SocialProof(){
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:12,
      background:'var(--card)', border:'1px solid var(--line)',
      borderRadius:18, padding:'12px 14px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{display:'flex'}}>
        {[0,1,2,3].map(i => {
          const initials = ['ผ','น','ก','T'];
          const colors = ['var(--butter)', 'var(--mint)', 'var(--coral-soft)', 'var(--sky)'];
          return (
            <div key={i} style={{
              width:34, height:34, borderRadius:99, border:'2px solid #fff',
              marginLeft: i===0 ? 0 : -12,
              background: colors[i], overflow:'hidden', position:'relative',
              display:'grid', placeItems:'center',
              fontSize:12, fontWeight:700, color:'var(--ink)',
              boxShadow:'0 1px 3px rgba(0,0,0,.08)',
            }}>
              <span style={{position:'absolute'}}>{initials[i]}</span>
              <img
                src={`assets/avatar-${i+1}.png`}
                alt=""
                onError={(e)=>{ e.currentTarget.style.display='none'; }}
                style={{
                  position:'absolute', inset:0, width:'100%', height:'100%',
                  objectFit:'cover', borderRadius:'50%',
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{fontSize:13, lineHeight:1.35}}>
        <strong>ไว้วางใจโดยนักเรียนกว่า 20,000 คน</strong>ทั่วประเทศไทย
        <div className="tiny muted" style={{marginTop:2}}>⭐⭐⭐⭐⭐ คะแนนเฉลี่ย 4.9 / 5</div>
      </div>
      <div className="tiny" style={{
        background:'var(--mint-soft)', color:'var(--mint-ink)',
        padding:'6px 10px', borderRadius:999, fontWeight:700,
      }}>ตั้งแต่ปี 2019</div>
    </div>
  );
}

function WhyParentsTrust(){
  const items = [
    { t:'เน้นโฟนิกส์เป็นพื้นฐาน', d:'เด็กอ่านคำภาษาอังกฤษด้วยการถอดเสียง ไม่ใช่ท่องจำ', e:'🔤' },
    { t:'เรียนสดกับครูโบว์', d:'สอนเด็กไทยมากกว่า 10 ปี ไม่ใช่วิดีโอย้อนหลังแบบเติมเวลา', e:'👩‍🏫' },
    { t:'แผนเรียนเฉพาะลูกของคุณ', d:'Matched to your child\'s level, goals & schedule.', e:'🎯' },
  ];
  return (
    <div>
      <div className="micro muted" style={{textAlign:'center', marginBottom:14}}>ทำไมผู้ปกครองเลือก Engbrain</div>
      <div style={{display:'grid', gap:10}}>
        {items.map(it => (
          <div key={it.t} className="card" style={{padding:'14px 16px', display:'grid', gridTemplateColumns:'40px 1fr', gap:12, alignItems:'center', boxShadow:'var(--shadow-sm)'}}>
            <div style={{
              width:40, height:40, borderRadius:12, background:'var(--coral-soft)',
              display:'grid', placeItems:'center', fontSize:20,
            }}>{it.e}</div>
            <div>
              <div style={{fontWeight:700, fontSize:14}}>{it.t}</div>
              <div className="tiny muted" style={{marginTop:2}}>{it.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StickyContactBar(){
  return (
    <div style={{
      marginTop:18,
      padding:'0 0 calc(8px + env(safe-area-inset-bottom, 0px))',
    }}>
      <div style={{
        maxWidth:520, margin:'0 auto',
        display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8,
        background:'var(--card)', borderRadius:22, padding:6,
        border:'1px solid var(--line)', boxShadow:'var(--shadow-sm)',
      }}>
        <ContactMini label="LINE" sub="@engbrain" color="#06C755" icon="line" />
        <ContactMini label="เมสเซนเจอร์" sub="KruBow" color="#0084FF" icon="msg" />
        <ContactMini label="โทร" sub="096-005-6150" color="var(--ink)" icon="call" />
      </div>
    </div>
  );
}

const MINI_HREFS = { line:'https://line.me/R/ti/p/%40engbrain', msg:'https://m.me/2377290269217014', call:'tel:0960056150' };
function ContactMini({ label, sub, color, icon }){
  return (
    <a href={MINI_HREFS[icon]} target={icon==='call'?'_self':'_blank'} rel="noopener noreferrer" className="btn" style={{
      padding:'10px 10px', borderRadius:999, background:'transparent', textDecoration:'none', color:'var(--ink)',
      display:'grid', gridTemplateColumns:'26px 1fr', gap:8, alignItems:'center',
      textAlign:'left', minWidth:0,
    }}>
      <div style={{
        width:26, height:26, borderRadius:99, background: color,
        display:'grid', placeItems:'center', color:'#fff', fontSize:13, fontWeight:700,
      }}>
        {icon==='line' && 'L'}
        {icon==='msg' && 'M'}
        {icon==='call' && '☎'}
      </div>
      <div style={{minWidth:0}}>
        <div style={{fontSize:12, fontWeight:700, lineHeight:1}}>{label}</div>
        <div className="muted" style={{fontSize:10, marginTop:2, lineHeight:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{sub}</div>
      </div>
    </a>
  );
}

Object.assign(window, { Welcome, StickyContactBar, BrandHeader });
