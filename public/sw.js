/* vai-rice.space — tiny image cache.
 * Avatars, banners and other pictures are served stale-while-revalidate:
 * a cached copy paints instantly, and a fresh copy is fetched in the background.
 *
 * IMPORTANT: the network fetch is started IMMEDIATELY, before any Cache Storage
 * access, and cache writes happen in waitUntil() — off the response path. Doing
 * cache open/put inside the response path serializes requests behind the cache
 * write-lock, which made images load one-by-one instead of in parallel.
 *
 * Only same-origin images are touched — live stats.json, HTML and hashed JS/CSS
 * bundles are left to the browser. */
const CACHE = 'vai-img-v2';
const IMG_RE = /\.(?:png|jpe?g|webp|avif|gif|svg|ico)$/i;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
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
      // Kick the network off first so every image fetch runs in parallel —
      // never gated behind a Cache Storage lock.
      const fetching = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            // Populate the cache off the response path.
            event.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}));
          }
          return res;
        })
        .catch(() => null);

      // Instant paint from cache if we have it; the fetch above still refreshes it.
      const cached = await caches.match(req);
      if (cached) return cached;

      const res = await fetching;
      return res || Response.error();
    })()
  );
});
