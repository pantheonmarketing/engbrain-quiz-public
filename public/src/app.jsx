// App shell — orchestrates Welcome → Quiz → Loading → Results
const { useState, useEffect } = React;

// ── Lead notification ──────────────────────────────────────────────────────
async function submitLead(answers, path, match) {
  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, path, match: { title: match.title, tag: match.tag } }),
    });
    if (!response.ok) console.warn('Lead submission failed', response.status);
  } catch (e) {
    console.warn('Lead submission failed', e);
  }
}

// ── App ────────────────────────────────────────────────────────────────────
function App(){
  const [, force] = useState(0);
  window.__render = () => force(x=>x+1);

  const jump = window.TWEAKS?.step || 'welcome';

  const [view, setView] = useState('welcome');
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [path, setPath] = useState('parent');

  useEffect(() => {
    if (jump === 'welcome') setView('welcome');
    else if (jump === 'loading') setView('loading');
    else if (jump === 'result') {
      setAnswers(a => ({ ...a, 2: a[2] || { name:'Prim', age:'7', grade:'Grade 1' }, 4:'confident', 5:'done', 8:'1on1', 9:'3-6k' }));
      setPath('parent');
      setView('result');
    } else {
      const n = parseInt(jump, 10);
      if (!Number.isNaN(n)) {
        if (n >= 5) setAnswers(a => ({ ...a, 2: a[2] || { name:'Prim', age:'7', grade:'Grade 1' }, 4:'confident' }));
        setStep(n);
        setView('quiz');
      }
    }
  }, [jump]);

  const handleQuizDone = (finalAnswers, finalPath) => {
    const match = pickMatch(finalAnswers, finalPath);
    submitLead(finalAnswers, finalPath, match);
    setView('loading');
  };

  return (
    <div className="stage">
      {view === 'welcome' && <Welcome onStart={()=>{ setView('quiz'); setStep(1); }}/>}
      {view === 'quiz'    && <Quiz
        answers={answers} setAnswers={setAnswers}
        step={step} setStep={setStep}
        path={path} setPath={setPath}
        onBackToWelcome={()=>{ setAnswers({}); setStep(1); setPath('parent'); setView('welcome'); }}
        onDone={(a, p) => handleQuizDone(a, p)}
      />}
      {view === 'loading' && <BuildingProfile onDone={()=> setView('result')}/>}
      {view === 'result'  && <Results answers={answers} path={path} onRestart={()=>{ setAnswers({}); setStep(1); setPath('parent'); setView('welcome'); }}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
