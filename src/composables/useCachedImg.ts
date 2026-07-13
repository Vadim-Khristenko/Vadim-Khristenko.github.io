/**
 * Page-level image "super cache" — no service worker, no request interception.
 *
 * Three layers, fastest first:
 *   1. session memo (url → blob URL): synchronous, instant, zero network.
 *   2. persisted index (localStorage): a synchronous "is this URL in Cache
 *      Storage?" hint, so on a reload a cached image waits ~ms for its blob
 *      instead of hitting the network (real zero-network on flaky connections).
 *   3. unknown URLs: shown from the network immediately (correct), then quietly
 *      copied into the cache for next time.
 *
 * `prefetch()` warms the whole set on idle so filtering to any card is instant.
 * Nothing is intercepted, so it can never deadlock; a stale hint self-heals.
 */
const CACHE = 'vai-img-cache';
const INDEX_KEY = 'vai-img-index';

const isClient = typeof window !== 'undefined';
const hasCaches = isClient && 'caches' in window;

// url → blob URL, built once per URL per page load
const memo = new Map<string, string>();
// URLs we believe are already in Cache Storage (synchronous hint, persisted)
const known = new Set<string>();

if (isClient) {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (raw) (JSON.parse(raw) as string[]).forEach((u) => known.add(u));
  } catch (e) {
    /* ignore */
  }
}

function persistIndex() {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify([...known]));
  } catch (e) {
    /* ignore */
  }
}
function remember(url: string) {
  if (!known.has(url)) {
    known.add(url);
    persistIndex();
  }
}
function forget(url: string) {
  if (known.has(url)) {
    known.delete(url);
    persistIndex();
  }
}
function sameOrigin(u: string): boolean {
  try {
    return new URL(u, window.location.href).origin === window.location.origin;
  } catch (e) {
    return false;
  }
}
function cacheable(url?: string): url is string {
  return isClient && hasCaches && !!url && sameOrigin(url);
}

/** Synchronous: a ready blob URL from this session's memo, if any. */
export function memoedBlob(url?: string): string | undefined {
  return url ? memo.get(url) : undefined;
}

/** Synchronous best-guess: is this URL already in Cache Storage? */
export function isCached(url?: string): boolean {
  return !!url && known.has(url);
}

/** Async: a blob URL if the image is cached, else undefined (+ populate in bg). */
export async function resolveCachedImg(url?: string): Promise<string | undefined> {
  if (!cacheable(url)) return undefined;

  const m = memo.get(url);
  if (m) return m;

  let cache: Cache;
  try {
    cache = await caches.open(CACHE);
  } catch (e) {
    return undefined;
  }

  try {
    const hit = await cache.match(url);
    if (hit) {
      const blobUrl = URL.createObjectURL(await hit.blob());
      memo.set(url, blobUrl);
      remember(url);
      return blobUrl;
    }
  } catch (e) {
    /* fall through */
  }

  // Not actually cached — heal a stale hint, then populate for next time.
  forget(url);
  (async () => {
    try {
      const res = await fetch(url, { cache: 'force-cache' });
      if (res && res.ok) {
        await cache.put(url, res.clone());
        remember(url);
      }
    } catch (e) {
      /* the real URL is already showing */
    }
  })();

  return undefined;
}

/** Warm a batch of images into the cache on idle (skips already-cached ones). */
export function prefetch(urls: Array<string | undefined>) {
  if (!isClient || !hasCaches) return;
  const list = [...new Set(urls.filter((u): u is string => cacheable(u) && !isCached(u) && !memo.has(u)))];
  if (!list.length) return;

  const run = async () => {
    let cache: Cache;
    try {
      cache = await caches.open(CACHE);
    } catch (e) {
      return;
    }
    for (const url of list) {
      try {
        if (await cache.match(url)) {
          remember(url);
          continue;
        }
        const res = await fetch(url, { cache: 'force-cache' });
        if (res && res.ok) {
          await cache.put(url, res.clone());
          remember(url);
        }
      } catch (e) {
        /* ignore individual failures */
      }
    }
  };

  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
    .requestIdleCallback;
  if (ric) ric(run, { timeout: 4000 });
  else setTimeout(run, 1500);
}
