import { test, expect, beforeAll } from 'bun:test';

// Mock the browser globals the cache relies on, then import the module.
let mod: typeof import('../src/composables/useCachedImg');
const cacheStore = new Map<string, unknown>();
let fetches: string[] = [];
const ls: Record<string, string> = {};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

beforeAll(async () => {
  (globalThis as any).window = globalThis;
  (globalThis as any).location = { href: 'https://vai-rice.space/', origin: 'https://vai-rice.space' };
  (globalThis as any).localStorage = {
    getItem: (k: string) => (k in ls ? ls[k] : null),
    setItem: (k: string, v: string) => { ls[k] = v; },
    removeItem: (k: string) => { delete ls[k]; },
  };
  const cache = {
    match: async (u: string) => cacheStore.get(u),
    put: async (u: string, r: unknown) => { cacheStore.set(u, r); },
  };
  (globalThis as any).caches = { open: async () => cache };
  (globalThis as any).fetch = async (u: string) => {
    fetches.push(u);
    return { ok: true, clone: () => ({ blob: async () => ({}) }), blob: async () => ({}) };
  };
  (globalThis as any).URL.createObjectURL = () => 'blob:' + Math.random().toString(36).slice(2, 8);
  (globalThis as any).requestIdleCallback = (cb: () => void) => setTimeout(cb, 0);

  mod = await import('../src/composables/useCachedImg');
});

test('cross-origin images are never cached', async () => {
  expect(await mod.resolveCachedImg('https://cdn.other.com/a.png')).toBeUndefined();
});

test('a miss returns undefined, then populates the cache + remembers it', async () => {
  const url = '/avatars/miss.png';
  expect(mod.isCached(url)).toBe(false);
  expect(await mod.resolveCachedImg(url)).toBeUndefined();
  await wait(20); // background populate
  expect(cacheStore.has(url)).toBe(true);
  expect(mod.isCached(url)).toBe(true); // persisted sync hint
});

test('a hit returns a blob URL and memoizes it (zero network next time)', async () => {
  const url = '/avatars/hit.png';
  cacheStore.set(url, { blob: async () => ({}) });
  const r = await mod.resolveCachedImg(url);
  expect(typeof r).toBe('string');
  expect(r!.startsWith('blob:')).toBe(true);
  expect(mod.memoedBlob(url)).toBe(r); // synchronous memo
  expect(mod.isCached(url)).toBe(true);
});

test('prefetch warms uncached urls and skips already-cached ones', async () => {
  fetches = [];
  mod.prefetch(['/avatars/pre1.png', '/avatars/pre2.png', '/avatars/hit.png']);
  await wait(30);
  expect(cacheStore.has('/avatars/pre1.png')).toBe(true);
  expect(cacheStore.has('/avatars/pre2.png')).toBe(true);
  expect(fetches).not.toContain('/avatars/hit.png'); // already cached → not refetched
});
