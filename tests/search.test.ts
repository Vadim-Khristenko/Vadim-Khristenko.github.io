import { test, expect } from 'bun:test';
import { normalize, matchesQuery, localizedAll, haystack } from '../src/lib/search';
import { friends } from '../src/data/friends';
import { inspirations } from '../src/data/inspirations';

// ── unit: normalize ─────────────────────────────────────────
test('normalize: lowercases, strips diacritics and collapses whitespace', () => {
  expect(normalize('  MASHA  ')).toBe('masha');
  expect(normalize('Séméon')).toBe('semeon');
  expect(normalize('Семён')).toBe(normalize('Семен')); // ё unifies with е
  expect(normalize('a   b\tc')).toBe('a b c');
});

// ── unit: matchesQuery (token-AND, case/diacritic-insensitive) ─
test('matchesQuery: every token must appear; empty query matches all', () => {
  expect(matchesQuery('Masha Rice muse', 'rice masha')).toBe(true);
  expect(matchesQuery('Masha Rice', 'rice bob')).toBe(false);
  expect(matchesQuery('anything', '')).toBe(true);
  expect(matchesQuery('Семён (Ekevoki)', 'семен')).toBe(true);
});

// ── unit: localizedAll ──────────────────────────────────────
test('localizedAll: returns every language variant', () => {
  expect(localizedAll({ ru: 'Семён', en: 'Semyon', zh: '谢苗' }).sort()).toEqual(
    ['Semyon', 'Семён', '谢苗'].sort()
  );
  expect(localizedAll('plain')).toEqual(['plain']);
  expect(localizedAll(undefined)).toEqual([]);
  expect(localizedAll({ ru: 'x', en: '' })).toEqual(['x']);
});

// ── integration: cross-language search over real data ───────
const nameHay = (f: any) => haystack(localizedAll(f.name), (f.tags ?? []).flatMap(localizedAll));
const semyon = friends.find((f) => localizedAll(f.name).some((n) => n.includes('Ekevoki')))!;
const masha = friends.find((f) => localizedAll(f.name).some((n) => n.includes('Rice')))!;

test('Semyon is found by name in EVERY language (the reported bug)', () => {
  for (const term of ['Semyon', 'Семён', 'семен', '谢苗', 'ekevoki']) {
    expect(matchesQuery(nameHay(semyon), term)).toBe(true);
  }
});

test('searching "Semyon" does NOT return Masha', () => {
  for (const term of ['Semyon', 'Семён', 'Ekevoki']) {
    expect(matchesQuery(nameHay(masha), term)).toBe(false);
  }
});

test('inspirations are searchable by name in any language', () => {
  const filian = inspirations.find((p) => localizedAll(p.name).some((n) => n.includes('Filian')))!;
  const hay = haystack(localizedAll(filian.name), localizedAll(filian.role), localizedAll(filian.desc));
  expect(matchesQuery(hay, 'filian')).toBe(true);
  expect(matchesQuery(hay, 'FILIAN')).toBe(true);
});
