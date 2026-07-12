/* Retired. The image-caching service worker deadlocked image requests
 * (cloned responses held connections open behind the cache write-lock),
 * so this is now a self-destroying no-op: it clears its old caches and
 * unregisters itself. There is NO fetch handler, so nothing is intercepted
 * and images load straight from the network / browser HTTP cache. */
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      try {
        var keys = await caches.keys();
        await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      } catch (e) {}
      try { await self.registration.unregister(); } catch (e) {}
      try { await self.clients.claim(); } catch (e) {}
    })()
  );
});
