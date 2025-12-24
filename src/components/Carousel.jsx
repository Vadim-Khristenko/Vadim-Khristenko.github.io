import { useEffect, useRef, useState, useCallback } from 'react';
import { ui, defaultLang } from '../i18n/translations';

export default function Carousel({ lang = defaultLang }) {
  const t = ui[lang] || ui[defaultLang];
  
  // --- State ---
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imgState, setImgState] = useState('loading'); // 'loading', 'loaded', 'error'
  const [isPaused, setIsPaused] = useState(false);
  
  // --- Refs ---
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // --- Zoom/Pan/Touch State ---
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 }); // Track last mouse/touch position for delta
  const touchStartRef = useRef(null); // For swipe detection
  const pinchStartDist = useRef(null); // For pinch zoom
  const startScale = useRef(1); // For pinch zoom

  // --- Data Loading ---
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const parse = (json) => Object.keys(json).sort((a, b) => {
        const na = parseInt(a, 10), nb = parseInt(b, 10);
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        return a.localeCompare(b);
      }).map((f) => ({ file: f, meta: json[f] }));

      try {
        const r = await fetch('/arts/credits.json');
        if (!r.ok) throw new Error('Failed to load');
        const json = await r.json();
        if (mounted) {
          setItems(parse(json));
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // --- Navigation Helpers ---
  const resetZoom = useCallback(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
    setImgState('loading');
  }, []);

  const nextSlide = useCallback(() => {
    setIndex(prev => (prev + 1) % items.length);
    resetZoom();
  }, [items.length, resetZoom]);

  const prevSlide = useCallback(() => {
    setIndex(prev => (prev - 1 + items.length) % items.length);
    resetZoom();
  }, [items.length, resetZoom]);

  // --- Autoplay ---
  useEffect(() => {
    if (loading || items.length === 0 || isPaused || transform.scale > 1) return;
    
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timerRef.current);
  }, [index, loading, items.length, isPaused, transform.scale, nextSlide]);

  // --- Wheel Zoom (Desktop) ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault(); // Stop page scroll
      
      const scaleAmount = -e.deltaY * 0.001;
      
      setTransform(prev => {
        const newScale = Math.min(Math.max(1, prev.scale + scaleAmount), 4);
        // If zooming out to 1, reset position to center
        if (newScale <= 1) return { scale: 1, x: 0, y: 0 };
        return { ...prev, scale: newScale };
      });
    };

    // { passive: false } is crucial for e.preventDefault() to work
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // --- Mouse Handlers ---
  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    setTransform(prev => ({ 
      ...prev, 
      x: prev.x + dx / prev.scale, 
      y: prev.y + dy / prev.scale 
    }));
  };

  const handleMouseUp = (e) => {
    isDragging.current = false;
    if (containerRef.current) containerRef.current.style.cursor = transform.scale > 1 ? 'grab' : 'default';

    // Swipe detection if scale is 1
    if (transform.scale === 1) {
      // We can't use lastPos for swipe start, we need a separate start tracker or just use the total movement
      // But since we update x/y during move, we can check if x is significantly shifted
      // Wait, if scale is 1, we reset x/y in setTransform usually? 
      // No, we allow x/y to change, then snap back.
      
      const threshold = 50;
      if (Math.abs(transform.x) > threshold) {
        if (transform.x > 0) prevSlide();
        else nextSlide();
      } else {
        setTransform(prev => ({ ...prev, x: 0, y: 0 }));
      }
    }
  };

  // --- Touch Handlers (Mobile) ---
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      // Pan / Swipe
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
      lastPos.current = { x: t.clientX, y: t.clientY };
      isDragging.current = true;
    } else if (e.touches.length === 2) {
      // Pinch Start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDist.current = dist;
      startScale.current = transform.scale;
      isDragging.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging.current) {
      const t = e.touches[0];
      const dx = t.clientX - lastPos.current.x;
      const dy = t.clientY - lastPos.current.y;
      lastPos.current = { x: t.clientX, y: t.clientY };

      if (transform.scale > 1) {
        // Pan
        if (e.cancelable) e.preventDefault();
        setTransform(prev => ({ 
          ...prev, 
          x: prev.x + dx / prev.scale, 
          y: prev.y + dy / prev.scale 
        }));
      } else {
        // Swipe (Horizontal only)
        // Check dominant axis
        const totalDx = t.clientX - touchStartRef.current.x;
        const totalDy = t.clientY - touchStartRef.current.y;
        
        if (Math.abs(totalDx) > Math.abs(totalDy) && Math.abs(totalDx) > 10) {
           if (e.cancelable) e.preventDefault();
           // Move X only
           setTransform(prev => ({ ...prev, x: prev.x + dx, y: 0 })); 
        }
      }
    } else if (e.touches.length === 2 && pinchStartDist.current) {
      // Pinch Zoom
      if (e.cancelable) e.preventDefault();
      
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const scaleFactor = dist / pinchStartDist.current;
      const newScale = Math.min(Math.max(1, startScale.current * scaleFactor), 4);
      
      setTransform(prev => {
        if (newScale <= 1) return { scale: 1, x: 0, y: 0 };
        return { ...prev, scale: newScale };
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      pinchStartDist.current = null;
    }
    
    if (e.touches.length === 0) {
      isDragging.current = false;
      
      if (transform.scale <= 1) {
        // Swipe check
        const threshold = 50;
        if (Math.abs(transform.x) > threshold) {
          if (transform.x > 0) prevSlide();
          else nextSlide();
        } else {
          setTransform(prev => ({ ...prev, x: 0, y: 0 }));
        }
      }
    }
  };

  // --- Keyboard Nav ---
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key.toLowerCase() === 'r') resetZoom();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextSlide, prevSlide, resetZoom]);

  // --- Render Helpers ---
  const handleImageLoad = () => setImgState('loaded');
  const handleImageError = () => setImgState('error');
  const handleRetry = () => {
    setImgState('loading');
    // Trigger re-render by toggling a dummy state or just relying on key change if needed
    // Ideally, we might want to append a timestamp to the src, but let's try simple reset first
    setIndex(prev => prev); 
  };

  if (loading) return (
    <div className="h-64 md:h-96 flex items-center justify-center text-white/50 animate-pulse">
      {t['carousel.loading']}
    </div>
  );
  
  if (items.length === 0) return null;

  const currentItem = items[index];

  return (
    <div 
      className="relative group rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl backdrop-blur-sm select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={containerRef}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <img 
          src={`/arts/${currentItem.file}`} 
          className="w-full h-full object-cover blur-3xl opacity-30 scale-110 transition-opacity duration-700" 
          alt="" 
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Viewer Area */}
      <div 
        className="relative z-10 h-[50vh] md:h-[75vh] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Spinner */}
        {imgState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        {/* Error State */}
        {imgState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20">
            <p className="text-red-400 mb-2">{t['carousel.error']}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition"
            >
              {t['carousel.retry']}
            </button>
          </div>
        )}

        {/* The Image */}
        <img
          key={`${currentItem.file}-${index}`} 
          ref={imgRef}
          src={`/arts/${currentItem.file}`}
          alt={currentItem.meta?.description || 'Art'}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ease-out ${
            imgState === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
            cursor: transform.scale > 1 ? 'grab' : 'default',
            transition: isDragging.current ? 'none' : 'transform 0.1s ease-out'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-20">
        
        {/* Top: Zoom Hint */}
        <div className="p-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-black/50 backdrop-blur text-xs px-3 py-1 rounded-full text-white/70 border border-white/10 shadow-lg">
            {t['carousel.hint']}
          </span>
        </div>

        {/* Middle: Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-4 pointer-events-none">
          <button 
            onClick={prevSlide}
            className="pointer-events-auto p-3 md:p-4 rounded-full bg-black/20 hover:bg-black/50 border border-white/5 backdrop-blur text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button 
            onClick={nextSlide}
            className="pointer-events-auto p-3 md:p-4 rounded-full bg-black/20 hover:bg-black/50 border border-white/5 backdrop-blur text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {/* Bottom: Info & Dots */}
        <div className="mt-auto bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 pt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          
          {/* Text Info */}
          <div className="pointer-events-auto max-w-full md:max-w-2xl">
            <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-md line-clamp-2">
              {currentItem.meta?.description || 'Artwork'}
            </h3>
            <p className="text-white/60 text-sm mt-1">
              by {currentItem.meta?.author || t['carousel.unknown']}
              {currentItem.meta?.source && (
                <> · <a href={currentItem.meta.source} target="_blank" rel="noopener" className="text-blue-300 hover:text-blue-200 underline decoration-blue-300/30 transition-colors">Source</a></>
              )}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 pointer-events-auto overflow-x-auto max-w-full pb-2 scrollbar-hide mask-linear-fade">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); resetZoom(); }}
                className={`h-2 rounded-full transition-all duration-300 shrink-0 ${
                  i === index 
                    ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                    : 'bg-white/20 w-2 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
