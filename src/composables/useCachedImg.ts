import { ref } from 'vue';

/**
 * Page-level image cache — no service worker, no request interception.
 *
 * Strategy (exactly the "direct HTTP, then cache" idea):
 *  · First visit: the real URL is used immediately, so the browser loads it
 *    directly and in parallel (fast). Once it is in the browser HTTP cache we
 *    copy it into a Cache Storage bucket in the background.
 *  · Repeat ("warm") visits: we read that bucket first and serve the image from
 *    a local blob — zero network, which is what makes it instant even on a flaky
 *    connection (no 304 revalidation round-trips).
 *
 * Nothing is intercepted, so it cannot deadlock: the real URL is always the
 * fallback, and if the cache is slow/unavailable the image just loads normally.
 */
const CACHE = 'vai-img-cache';
const WARM_KEY = 'vai-img-warm';

// Build each blob URL once per URL per page load, and reuse it.
const memo = new Map<string, string>();

const isClient = typeof window !== 'undefined';
const hasCaches = isClient && 'caches' in window;

function isWarm(): boolean {
  try {
    return localStorage.getItem(WARM_KEY) === '1';
  } catch (e) {
    return false;
  }
}
function markWarm() {
  try {
    localStorage.setItem(WARM_KEY, '1');
  } catch (e) {
    /* ignore */
  }
}
function sameOrigin(u: string): boolean {
  try {
    return new URL(u, window.location.href).origin === window.location.origin;
  } catch (e) {
    return false;
  }
}

export function useCachedImg(url: string | undefined) {
  // Only local images are cached (Cache Storage can't store opaque cross-origin
  // responses). Everything else just uses the URL directly.
  if (!isClient || !hasCaches || !url || !sameOrigin(url)) {
    return { src: ref(url) };
  }

  // Already resolved to a blob earlier this session.
  if (memo.has(url)) {
    return { src: ref(memo.get(url)!) };
  }

  const warm = isWarm();
  // Warm visit → hold off painting until the cache answers (so we don't fire a
  // network request we don't need). Cold visit → paint the real URL immediately.
  const src = ref<string | undefined>(warm ? undefined : url);

  async function populate(cache: Cache) {
    try {
      // force-cache → served from the browser HTTP cache when possible (cheap),
      // so this rarely hits the network on a cold load.
      const res = await fetch(url as string, { cache: 'force-cache' });
      if (res && res.ok) await cache.put(url as string, res.clone());
      markWarm();
    } catch (e) {
      /* ignore — the image still displayed from the real URL */
    }
  }

  // Safety valve: never leave the image blank for long if the cache stalls.
  if (warm) {
    setTimeout(() => {
      if (src.value === undefined) src.value = url;
    }, 150);
  }

  (async () => {
    let cache: Cache;
    try {
      cache = await caches.open(CACHE);
    } catch (e) {
      if (src.value === undefined) src.value = url;
      return;
    }

    if (warm) {
      let hit: Response | undefined;
      try {
        hit = await cache.match(url as string);
      } catch (e) {
        hit = undefined;
      }
      if (hit) {
        try {
          const blobUrl = URL.createObjectURL(await hit.blob());
          memo.set(url as string, blobUrl);
          src.value = blobUrl;
          return;
        } catch (e) {
          /* fall through to the real URL */
        }
      }
      // warm but this one isn't cached yet → show it and cache for next time
      if (src.value === undefined) src.value = url;
      populate(cache);
    } else {
      // cold visit: real URL is already showing; just warm the cache.
      populate(cache);
    }
  })();

  return { src };
}
