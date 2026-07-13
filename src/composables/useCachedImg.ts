/**
 * Page-level image cache — no service worker, no request interception.
 *
 * `resolveCachedImg(url)` returns a local blob URL when the image is already in
 * the Cache Storage bucket (instant, zero network — great on flaky nets), or
 * undefined when it isn't (and populates the cache in the background). The caller
 * keeps showing the real URL and only swaps to the blob if one comes back, so the
 * image is always correct and never sticky. Nothing is intercepted → no deadlocks.
 */
const CACHE = 'vai-img-cache';

// Build each blob URL once per URL per page load, then reuse it.
const memo = new Map<string, string>();

const isClient = typeof window !== 'undefined';
const hasCaches = isClient && 'caches' in window;

function sameOrigin(u: string): boolean {
  try {
    return new URL(u, window.location.href).origin === window.location.origin;
  } catch (e) {
    return false;
  }
}

export async function resolveCachedImg(url: string | undefined): Promise<string | undefined> {
  // Only local images are cached (Cache Storage can't store opaque cross-origin
  // responses). Everything else just uses the URL directly.
  if (!isClient || !hasCaches || !url || !sameOrigin(url)) return undefined;

  if (memo.has(url)) return memo.get(url);

  let cache: Cache;
  try {
    cache = await caches.open(CACHE);
  } catch (e) {
    return undefined;
  }

  // Cache hit → hand back a blob URL (served from disk, no network).
  try {
    const hit = await cache.match(url);
    if (hit) {
      const blobUrl = URL.createObjectURL(await hit.blob());
      memo.set(url, blobUrl);
      return blobUrl;
    }
  } catch (e) {
    /* fall through to populate */
  }

  // Miss → populate for next time, off the critical path.
  (async () => {
    try {
      // force-cache → served from the browser HTTP cache when possible (cheap).
      const res = await fetch(url, { cache: 'force-cache' });
      if (res && res.ok) await cache.put(url, res.clone());
    } catch (e) {
      /* ignore — the real URL is already showing */
    }
  })();

  return undefined;
}
