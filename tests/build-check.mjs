#!/usr/bin/env node
/**
 * Build verification for vai-rice.space
 * Run after `bun run build`. Checks the dist/ output AND the source for:
 *   · every blog post has all language versions (ru/en/zh)
 *   · i18n translation keys are in parity across ru/en/zh (nothing missing)
 *   · no broken internal links (404s) in the generated HTML
 *   · SEO essentials, required pages and assets are present
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DIST = resolve('./dist');
const SRC = resolve('./src');
const LANGS = ['ru', 'en', 'zh'];

let failures = 0;
let warnings = 0;
const fail = (m) => { console.error(`  \x1b[31m✗\x1b[0m ${m}`); failures++; };
const warn = (m) => { console.warn(`  \x1b[33m!\x1b[0m ${m}`); warnings++; };
const pass = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const section = (t) => console.log(`\n\x1b[1m▸ ${t}\x1b[0m`);

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const item of readdirSync(dir)) {
    const full = join(dir, item);
    statSync(full).isDirectory() ? walk(full, files) : files.push(full);
  }
  return files;
}

// ── 1. Build output ──────────────────────────────────────────
section('1 · Build output');
if (!existsSync(DIST)) { fail('dist/ missing — run `bun run build` first'); process.exit(1); }
const top = readdirSync(DIST);
top.length ? pass(`dist/ has ${top.length} top-level entries`) : fail('dist/ is empty');

const indexPath = join(DIST, 'index.html');
if (!existsSync(indexPath)) { fail('index.html missing'); }
const indexHtml = existsSync(indexPath) ? readFileSync(indexPath, 'utf-8') : '';
if (indexHtml.length > 500) pass(`index.html ok (${indexHtml.length} chars)`);
else fail('index.html suspiciously small');

const astroDir = join(DIST, '_astro');
const vueRuntime = existsSync(astroDir) && readdirSync(astroDir).some((f) => f.includes('runtime-dom'));
vueRuntime ? pass('Vue runtime bundled') : fail('Vue runtime missing — the app will not mount');

// ── 2. Required pages ────────────────────────────────────────
section('2 · Required pages');
for (const [p, label] of [
  ['index.html', 'Homepage'],
  ['blog/index.html', 'Blog index'],
  ['editor/index.html', 'Content studio'],
  ['license/index.html', 'License page'],
  ['files/horizon/index.html', 'Lab · Horizon'],
  ['files/justcode/index.html', 'Lab · JustCode'],
  ['files/terminal/index.html', 'Lab · Terminal'],
]) {
  existsSync(join(DIST, p)) ? pass(`${label} → /${p}`) : fail(`${label} missing → /${p}`);
}

// ── 3. SEO & domain essentials ───────────────────────────────
section('3 · SEO & domain');
for (const [p, label] of [
  ['CNAME', 'CNAME'],
  ['sitemap.xml', 'sitemap'],
  ['robots.txt', 'robots.txt'],
  ['VAI-BANNER.png', 'OG banner'],
  ['data/stats.json', 'stats.json'],
  ['llms.txt', 'llms.txt'],
]) existsSync(join(DIST, p)) ? pass(`${label}`) : fail(`${label} missing → /${p}`);

if (indexHtml.includes('VAI-BANNER.png') && indexHtml.includes('application/ld+json'))
  pass('Homepage has OG image + JSON-LD');
else fail('Homepage missing OG image or JSON-LD');

const cname = existsSync(join(DIST, 'CNAME')) ? readFileSync(join(DIST, 'CNAME'), 'utf-8').trim() : '';
cname === 'vai-rice.space' ? pass(`CNAME = ${cname}`) : fail(`CNAME unexpected: "${cname}"`);

// ── 4. Blog post localization ────────────────────────────────
section('4 · Blog localization (ru/en/zh)');
const blogDir = join(SRC, 'content', 'blog');
const posts = existsSync(blogDir) ? readdirSync(blogDir).filter((f) => f.endsWith('.md')) : [];
const groups = {};
for (const f of posts) {
  const c = readFileSync(join(blogDir, f), 'utf-8');
  const fm = (c.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [, ''])[1];
  const lang = (fm.match(/\blang:\s*['"]?(\w+)['"]?/) || [, 'ru'])[1];
  const key = (fm.match(/\btranslationKey:\s*['"]?([\w-]+)['"]?/) || [, f.replace(/\.md$/, '')])[1];
  (groups[key] ||= []).push(lang);
}
if (!posts.length) warn('no blog posts found');
for (const [key, langs] of Object.entries(groups)) {
  const missing = LANGS.filter((l) => !langs.includes(l));
  if (missing.length) warn(`post "${key}" missing localization: ${missing.join(', ')}`);
  else pass(`post "${key}" · ru/en/zh complete`);
}

// ── 5. i18n key parity ───────────────────────────────────────
section('5 · i18n key parity');
function keysFor(lang) {
  const dir = join(SRC, 'i18n', 'translations', lang);
  if (!existsSync(dir)) return null;
  const set = new Set();
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts')) {
    const c = readFileSync(join(dir, f), 'utf-8');
    for (const m of c.matchAll(/^\s*['"]([\w.\-]+)['"]\s*:/gm)) set.add(m[1]);
  }
  return set;
}
const keySets = Object.fromEntries(LANGS.map((l) => [l, keysFor(l)]));
if (LANGS.some((l) => !keySets[l])) {
  fail('a translation folder is missing');
} else {
  const all = new Set(LANGS.flatMap((l) => [...keySets[l]]));
  let drift = 0;
  for (const l of LANGS) {
    const miss = [...all].filter((k) => !keySets[l].has(k));
    if (miss.length) { fail(`[${l}] missing ${miss.length} key(s): ${miss.slice(0, 5).join(', ')}${miss.length > 5 ? '…' : ''}`); drift += miss.length; }
  }
  if (!drift) pass(`all ${all.size} keys present in ru/en/zh`);
}

// ── 6. No broken internal links (404s) ───────────────────────
section('6 · Internal links (404s)');
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
let broken = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    const link = raw.split('#')[0].split('?')[0];
    if (!link || /^(https?:|\/\/|mailto:|tel:|data:)/.test(raw) || link === '/') continue;
    const resolved = link.startsWith('/')
      ? join(DIST, link.replace(/^\//, ''))
      : join(file, '..', link);
    // directory links resolve to their index.html
    const ok = existsSync(resolved) || existsSync(join(resolved, 'index.html'));
    if (!ok) { fail(`broken link in ${file.replace(DIST, '')}: ${link}`); broken++; }
  }
}
if (!broken) pass(`no broken links across ${htmlFiles.length} HTML files`);

// ── 7. Meta tags ─────────────────────────────────────────────
section('7 · Meta tags');
let metaBad = 0;
for (const file of htmlFiles) {
  const h = readFileSync(file, 'utf-8');
  if (!h.includes('<title>') || !h.includes('viewport') || !h.includes('charset=')) {
    fail(`missing base meta in ${file.replace(DIST, '')}`); metaBad++;
  }
}
if (!metaBad) pass(`all ${htmlFiles.length} pages have title/viewport/charset`);

// ── Summary ──────────────────────────────────────────────────
console.log('\n' + '─'.repeat(48));
if (failures === 0) {
  console.log(`\x1b[32m🎉 All checks passed\x1b[0m${warnings ? ` (\x1b[33m${warnings} warning(s)\x1b[0m)` : ''}. Ship it.`);
  process.exit(0);
} else {
  console.log(`\x1b[31m💥 ${failures} check(s) failed\x1b[0m, ${warnings} warning(s). Fix before deploying.`);
  process.exit(1);
}
