import { useEffect, useRef, useState } from 'react';

export default function ModeToggle(){
  const [vocaloid, setVocaloid] = useState(false);
  const audioRef = useRef(null);

  useEffect(()=>{
    const saved = localStorage.getItem('vocaloid-mode') === '1';
    if (saved) setVocaloid(true);
  },[]);

  useEffect(()=>{
    const root = document.documentElement;
    if (!audioRef.current) return;
    if (vocaloid) {
      localStorage.setItem('vocaloid-mode','1');
      root.classList.add('vocaloid');
      const a = audioRef.current;
      a.volume = 0.4;
      a.currentTime = 0;
      const tryPlay = () => a.play().catch(()=>{});
      tryPlay();
      showPopup('Anamanaguchi — Miku (feat. Hatsune Miku)');
    } else {
      localStorage.removeItem('vocaloid-mode');
      root.classList.remove('vocaloid');
      try { audioRef.current.pause(); } catch {}
    }
  }, [vocaloid]);

  useEffect(()=>{
    const a = audioRef.current;
    if (!a) return;
    const onError = () => {
      // fallback to legacy location if exists
      if (a.src.endsWith('/music/Anamanaguchi_Miku-Ft_Hatsune_Miku.mp3')) {
        a.src = '/assets/Anamanaguchi_-_Miku_.mp3';
      }
    };
    a.addEventListener('error', onError);
    return () => a.removeEventListener('error', onError);
  },[]);

  return (
    <div className="flex items-center gap-2">
      <button className={`px-3 py-2 rounded-lg border border-white/15 bg-white/10 hover:bg-white/20`} onClick={()=> setVocaloid(v => !v)} title="VOCALOID MODE">
        {vocaloid ? 'VOCALOID: ON' : 'VOCALOID: OFF'}
      </button>
      <audio ref={audioRef} src="/music/Anamanaguchi_Miku-Ft_Hatsune_Miku.mp3" preload="auto" />
    </div>
  );
}

function showPopup(title){
  const el = document.createElement('div');
  el.textContent = `♪ ${title}`;
  Object.assign(el.style, {
    position: 'fixed', bottom: '20px', right: '20px', padding: '10px 14px',
    background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
    color: '#00ffd1', borderRadius: '10px', zIndex: 60, fontWeight: '600',
    backdropFilter: 'blur(6px)'
  });
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 3500);
}
