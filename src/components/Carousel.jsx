import { useEffect, useRef, useState } from 'react';

export default function Carousel(){
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // zoom/pan state (per slide)
  const scaleRef = useRef(1);
  const offXRef = useRef(0);
  const offYRef = useRef(0);
  const draggingRef = useRef(false);
  const startRef = useRef({x:0,y:0});
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const loadedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  // smooth targets and inertia
  const scaleTargetRef = useRef(1);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const velXRef = useRef(0);
  const velYRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(()=>{
    let stopped = false;
    const load = async () => {
      const parse = (json)=> Object.keys(json).sort((a,b)=>{
        const na = parseInt(a,10), nb = parseInt(b,10);
        if (!isNaN(na) && !isNaN(nb)) return na-nb; else return a.localeCompare(b);
      }).map((f)=> ({ file: f, meta: json[f] }));
      try {
        const r = await fetch('/arts/credits.json', { cache: 'no-store' });
        const json = await r.json();
        if (!stopped) setItems(parse(json));
      } catch {
        try {
          const r = await fetch('/assets/arts/credits.json', { cache: 'no-store' });
          const json = await r.json();
          if (!stopped) setItems(parse(json));
        } catch {
          setItems([]);
        }
      }
    };
    load();
    return ()=>{ stopped = true; };
  },[]);

  useEffect(()=>{
    start();
    return stop;
  }, [index, items]);

  function start(){ if (reduceMotion) return; stop(); timer.current = setInterval(()=> setIndex(i=> (items.length? (i+1)%items.length : 0)), 6000); }
  function stop(){ if (timer.current){ clearInterval(timer.current); timer.current=null; } }

  function go(delta){
    resetZoom();
    setIndex(i=> {
      if (!items.length) return 0;
      const n = (i + delta) % items.length; return n<0? n+items.length : n;
    });
  }

  function resetZoom(){
    scaleTargetRef.current = 1;
    targetXRef.current = 0; targetYRef.current = 0;
    // snap current towards target for quick reset
    scaleRef.current = 1; offXRef.current = 0; offYRef.current = 0;
    updateTransform();
  }

  function updateTransform(){
    const img = imgRef.current; if (!img) return;
    img.style.transform = `scale(${scaleRef.current}) translate(${offXRef.current}px, ${offYRef.current}px)`;
  }

  function animate(){
    const friction = 0.92; // inertia decay
    const lerp = 0.18;     // smoothing towards targets

    // smooth scale towards target
    const s = scaleRef.current + (scaleTargetRef.current - scaleRef.current) * lerp;
    scaleRef.current = s;

    // apply velocity to targets (inertia)
    if (!draggingRef.current){
      targetXRef.current += velXRef.current;
      targetYRef.current += velYRef.current;
      velXRef.current *= friction;
      velYRef.current *= friction;
      if (Math.abs(velXRef.current) < 0.01) velXRef.current = 0;
      if (Math.abs(velYRef.current) < 0.01) velYRef.current = 0;
    }

    // smooth current offset towards target
    offXRef.current += (targetXRef.current - offXRef.current) * lerp;
    offYRef.current += (targetYRef.current - offYRef.current) * lerp;

    updateTransform();
    rafRef.current = requestAnimationFrame(animate);
  }

  function onWheel(e){
    if (reduceMotion) return;
    // prevent page scroll during zoom
    if (e.cancelable) e.preventDefault();
    const frame = frameRef.current; const img = imgRef.current;
    if (!frame || !img) return;
    const rect = frame.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const ratio = e.deltaY > 0 ? 0.9 : 1.1;
    const newScaleTarget = Math.max(1, Math.min(4, scaleRef.current * ratio));
    const deltaScale = newScaleTarget - scaleRef.current;
    // adjust targets to zoom towards cursor
    targetXRef.current -= (mx - rect.width/2) * deltaScale / Math.max(0.0001, scaleRef.current);
    targetYRef.current -= (my - rect.height/2) * deltaScale / Math.max(0.0001, scaleRef.current);
    scaleTargetRef.current = newScaleTarget;
  }

  // Add non-passive wheel listener to truly block scroll chaining
  useEffect(()=>{
    const el = frameRef.current;
    if (!el) return;
    const onWheelNative = (ev)=> onWheel(ev);
    el.addEventListener('wheel', onWheelNative, { passive: false });
    return ()=> el.removeEventListener('wheel', onWheelNative);
  }, [frameRef.current]);

  function onMouseDown(e){
    draggingRef.current = true;
    velXRef.current = 0; velYRef.current = 0; // stop inertia
    startRef.current = { x: e.clientX, y: e.clientY };
    frameRef.current?.classList.add('dragging');
  }
  function onMouseMove(e){
    if (!draggingRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    targetXRef.current += dx; targetYRef.current += dy;
    velXRef.current = dx; velYRef.current = dy; // capture velocity for inertia
    startRef.current = { x: e.clientX, y: e.clientY };
  }
  function onMouseUp(){
    draggingRef.current = false;
    frameRef.current?.classList.remove('dragging');
  }

  // touch swipe for navigation
  const touchStart = useRef({x:0,y:0});
  function onTouchStart(e){ const t=e.touches[0]; touchStart.current={x:t.clientX,y:t.clientY}; }
  function onTouchEnd(e){ const t=e.changedTouches[0]; const dx=t.clientX-touchStart.current.x; const dy=t.clientY-touchStart.current.y; if (Math.abs(dx)>Math.abs(dy) && Math.abs(dx)>30){ dx>0? go(-1):go(1); } }

  useEffect(()=>{
    function onKey(e){ if (e.key==='ArrowLeft') go(-1); else if (e.key==='ArrowRight') go(1); else if (e.key==='r' || e.key==='R') resetZoom(); }
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [items.length]);

  // start animation loop once
  useEffect(()=>{
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate);
    return ()=> { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current=null; };
  }, []);

  // smooth fade-in of image on slide change
  useEffect(()=>{ setLoaded(false); loadedRef.current = false; }, [index]);
  function onImgLoad(){ setLoaded(true); loadedRef.current = true; }

  // Preload next image to minimize visible gaps during transition
  useEffect(()=>{
    if (!items.length) return;
    const nextIdx = (index + 1) % items.length;
    const next = items[nextIdx];
    if (next && next.file){
      const pre = new Image();
      pre.src = `/arts/${next.file}`;
    }
  }, [index, items]);

  if (!items.length) return (<div className="text-center text-white/60">Загрузка артов…</div>);

  const current = items[index];
  const caption = (
    <span>
      {current.meta?.description || 'Artwork'} — {current.meta?.author ? (
        current.meta?.source ? <a className="underline hover:no-underline" href={current.meta.source} target="_blank" rel="noopener">{current.meta.author}</a> : <>{current.meta.author}</>
      ) : 'Автор неизвестен'}
      {current.meta?.source ? <> · <a className="underline hover:no-underline" href={current.meta.source} target="_blank" rel="noopener">source</a></> : null}
    </span>
  );

  return (
    <div className="carousel-wrap" onMouseEnter={stop} onMouseLeave={start}>
      <div className="carousel-frame zoom-container relative h-[70vh] md:h-[75vh] w-full overflow-hidden" ref={frameRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Карусель артов">
        <img
          ref={imgRef}
          src={`/arts/${current.file}`}
          alt={current.meta?.description || 'Artwork'}
          onLoad={onImgLoad}
          className={`zoom-image w-full h-full object-contain select-none will-change-transform transition-opacity duration-300 ease-out ${loaded? 'opacity-100' : 'opacity-0'}`}
          draggable={false}
        />
      </div>
      <div className="carousel-controls">
        <button onClick={()=>go(-1)} aria-label="Предыдущий арт">‹</button>
        <button onClick={()=>go(1)} aria-label="Следующий арт">›</button>
      </div>
      <p className="carousel-caption">{caption}</p>
      <div className="carousel-dots" role="tablist" aria-label="Навигация по артам">
        {items.map((_, i)=> (
          <button key={i} aria-selected={i===index} onClick={()=> { resetZoom(); setIndex(i); }} aria-label={`Показать арт ${i+1}`} />
        ))}
      </div>
      <p className="text-center text-white/60 text-sm">🔍 Скролл для зума • Драг для панораммы • R = сбросить</p>
    </div>
  );
}
