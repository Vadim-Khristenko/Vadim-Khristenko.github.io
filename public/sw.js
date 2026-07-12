/* vai-rice.space — tiny image cache.
 * Avatars, banners and other pictures are served stale-while-revalidate:
 * the cached copy is returned instantly, and a fresh copy is fetched in the
 * background for next time. Only same-origin images are touched — the live
 * stats.json, HTML and hashed JS/CSS bundles are left to the browser. */
const CACHE = 'vai-img-v1';
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
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
