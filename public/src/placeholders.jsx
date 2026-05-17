// Photo placeholders — striped SVG with mono label for "drop real photo here".
// We treat these as Big visual anchors so parents can imagine the scene.

const PLACEHOLDER_PALETTES = {
  warm:    { a: 'oklch(0.88 0.09 45)',  b: 'oklch(0.78 0.14 35)',  ink: '#4a2a18' },
  mint:    { a: 'oklch(0.88 0.07 160)', b: 'oklch(0.76 0.1 160)',  ink: '#1f3e2f' },
  butter:  { a: 'oklch(0.92 0.09 88)',  b: 'oklch(0.82 0.12 80)',  ink: '#4a3a14' },
  sky:     { a: 'oklch(0.88 0.06 230)', b: 'oklch(0.76 0.09 225)', ink: '#1f354c' },
  cream:   { a: 'oklch(0.94 0.03 78)',  b: 'oklch(0.86 0.05 65)',  ink: '#4a3a22' },
};

function Photo({ label, tone='warm', ratio='4/5', rounded=18, accent, style={}, hint, children }) {
  const pal = PLACEHOLDER_PALETTES[tone] || PLACEHOLDER_PALETTES.warm;
  const id = React.useId().replace(/:/g,'');
  return (
    <div style={{
      position:'relative', width:'100%', aspectRatio:ratio,
      borderRadius:rounded, overflow:'hidden',
      background: pal.a, ...style,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" style={{display:'block'}}>
        <defs>
          <pattern id={`s-${id}`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
            <rect width="22" height="22" fill={pal.a}/>
            <rect width="11" height="22" fill={pal.b} opacity=".55"/>
          </pattern>
          <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={pal.a} stopOpacity="0"/>
            <stop offset="100%" stopColor={pal.ink} stopOpacity=".18"/>
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#s-${id})`}/>
        <rect width="400" height="500" fill={`url(#g-${id})`}/>
      </svg>
      {label && (
        <div style={{
          position:'absolute', left:14, bottom:12, right:14,
          font: '600 10px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace',
          letterSpacing:'.08em', textTransform:'uppercase',
          color: pal.ink, opacity:.8,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <span style={{
            width:6, height:6, borderRadius:999, background: pal.ink, opacity:.6
          }}/>
          <span>{label}</span>
        </div>
      )}
      {hint && (
        <div style={{
          position:'absolute', left:14, top:12,
          font:'500 10px/1 ui-monospace, monospace',
          color: pal.ink, opacity:.55,
          padding:'5px 8px', borderRadius:6,
          background:'rgba(255,255,255,.35)', border:'1px dashed '+pal.ink
        }}>{hint}</div>
      )}
      {children}
    </div>
  );
}

// Coach avatar — photo disc / emoji / initial, driven by tweak
function CoachAvatar({ size=44, tone='warm' }) {
  const mode = window.TWEAKS?.avatar || 'photo';
  const pal = PLACEHOLDER_PALETTES[tone];
  if (mode === 'emoji') {
    return (
      <div style={{
        width:size, height:size, borderRadius:999,
        background:'var(--butter)', display:'grid', placeItems:'center',
        fontSize: size*0.55, border:'2px solid #fff', boxShadow:'var(--shadow-sm)'
      }}>👩‍🏫</div>
    );
  }
  if (mode === 'initial') {
    return (
      <div style={{
        width:size, height:size, borderRadius:999,
        background:'var(--coral)', color:'#fff',
        display:'grid', placeItems:'center',
        fontFamily:"'Noto Sans Thai', 'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight:600, fontSize:size*0.5,
        border:'2px solid #fff', boxShadow:'var(--shadow-sm)'
      }}>B</div>
    );
  }
  // photo disc placeholder
  return (
    <div style={{
      width:size, height:size, borderRadius:999, overflow:'hidden',
      border:'2px solid #fff', boxShadow:'var(--shadow-sm)',
      position:'relative', background: pal.a
    }}>
      <Photo tone={tone} rounded={0} ratio="1/1" label={null} />
      <div style={{
        position:'absolute', inset:0, display:'grid', placeItems:'center',
        font:'500 9px/1 ui-monospace, monospace', color: pal.ink, opacity:.6, letterSpacing:'.1em'
      }}>KRUBOW</div>
    </div>
  );
}

window.Photo = Photo;
window.CoachAvatar = CoachAvatar;
