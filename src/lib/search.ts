/**
 * Smart, language-agnostic search helpers shared by every searchable section
 * (Friends, Inspirations, Communities).
 *
 * The key idea: build the haystack from ALL language variants of a field, not
 * just the current locale — so "Semyon", "Семён" and "谢苗" all find the same
 * person no matter which UI language is active. Matching is diacritic-insensitive
 * and token-AND ("rice masha" matches only if both tokens appear).
 */
export type Localized = string | Record<string, string | undefined>;

const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');

/** lowercase + strip diacritics (é→e, ё→е) + collapse whitespace */
export function normalize(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(DIACRITICS, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every whitespace-separated token of the query must appear in the haystack. */
export function matchesQuery(haystackStr: string, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  const hay = normalize(haystackStr);
  return q.split(' ').every((tok) => hay.includes(tok));
}

/** All non-empty language variants of a Localized value (or the plain string). */
export function localizedAll(v: Localized | undefined | null): string[] {
  if (v == null) return [];
  if (typeof v === 'string') return v ? [v] : [];
  return Object.values(v).filter((x): x is string => !!x);
}

/** Flatten mixed string / string[] fragments into one searchable haystack. */
export function haystack(...parts: Array<string | string[] | undefined | null>): string {
  const out: string[] = [];
  for (const p of parts) {
    if (!p) continue;
    if (Array.isArray(p)) out.push(...p.filter(Boolean));
    else out.push(p);
  }
  return out.join(' ');
}
