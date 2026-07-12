/* vai-rice.space — image cache (cache-first).
 *
 * Why cache-first and not stale-while-revalidate: revalidating on every load
 * meant a Cache Storage write (put) for every image on every visit. Concurrent
 * writes hold the cache's write-lock, and the `match` in the response path then
 * queues behind them — which made images paint one-by-one and slowly. Cache-first
 * serves hits with ZERO writes, so all `match` reads run in parallel and repaint
 * instantly. Only genuine misses hit the network (once), then populate the cache
 * off the response path.
 *
 * Only same-origin images are handled — live stats.json, HTML and hashed JS/CSS
 * are left to the browser. */
const CACHE = 'vai-img-v3';
const IMG_RE = /\.(?:png|jpe?g|webp|avif|gif|svg|ico)$/i;

// Reuse a single open handle instead of caches.open() per request.
let cacheP;
function imgCache() {
  return (cacheP ||= caches.open(CACHE));
}

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Let the page drop the image cache on demand (?drop-img-cache=1).
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'drop-img-cache') {
    event.waitUntil(
      (async () => {
        await caches.delete(CACHE);
        cacheP = null;
        if (event.source) event.source.postMessage({ type: 'img-cache-dropped' });
      })()
    );
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (!IMG_RE.test(url.pathname)) return;

  event.respondWith(
    (async () => {
      const cache = await imgCache();

      // Cache-first: a hit returns instantly with no write, so reads never queue.
      const cached = await cache.match(req);
      if (cached) return cached;

      // Miss → fetch once, then populate off the response path.
      try {
        const res = await fetch(req);
        if (res && res.ok) {
          const copy = res.clone();
          event.waitUntil(cache.put(req, copy).catch(() => {}));
        }
        return res;
      } catch (e) {
        // last-ditch: maybe another in-flight request populated it
        return (await cache.match(req)) || Response.error();
      }
    })()
  );
});
