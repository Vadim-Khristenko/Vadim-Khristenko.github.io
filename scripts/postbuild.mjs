#!/usr/bin/env node
/**
 * Post-build script for VAI_PROG portfolio
 * Ensures static assets are present and applies domain-specific fixes.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const DIST = resolve('./dist');
const PUBLIC = resolve('./public');

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function copyAsset(src, dst) {
  const srcPath = resolve(src);
  const dstPath = resolve(dst);
  if (!existsSync(srcPath)) {
    console.warn(`⚠️  Source asset missing: ${src}`);
    return;
  }
  ensureDir(dstPath.replace(/\\[^\\]+$/, '').replace(/\/[^/]+$/, ''));
  copyFileSync(srcPath, dstPath);
  console.log(`📦 Copied ${src} → ${dst}`);
}

// ── Ensure the legacy standalone stylesheet exists in dist ──
// The site itself is styled by the bundled modular CSS (src/styles/main.css).
// public/styles/global.css is kept only for editor-EXPORTED standalone HTML.
if (!existsSync(join(DIST, 'styles'))) {
  mkdirSync(join(DIST, 'styles'), { recursive: true });
}
if (!existsSync(join(DIST, 'styles', 'global.css')) && existsSync(join(PUBLIC, 'styles', 'global.css'))) {
  copyFileSync(join(PUBLIC, 'styles', 'global.css'), join(DIST, 'styles', 'global.css'));
  console.log('📦 Copied public/styles/global.css → dist/styles/global.css (legacy export sheet)');
}

// ── Ensure favicon exists ──
if (!existsSync(join(DIST, 'favicon.svg')) && existsSync(join(PUBLIC, 'favicon.svg'))) {
  copyFileSync(join(PUBLIC, 'favicon.svg'), join(DIST, 'favicon.svg'));
  console.log('📦 Copied favicon.svg → dist/favicon.svg');
}

// ── Inject CNAME for custom domain on GitHub Pages ──
writeFileSync(join(DIST, 'CNAME'), 'vai-rice.space\n');
console.log('🌐 Created CNAME: vai-rice.space');

// ── Verify HTML integrity ──
const indexPath = join(DIST, 'index.html');
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf-8');
  // The site is styled by the bundled modular CSS — ensure a hashed sheet is linked.
  if (!/_astro\/[^"']+\.css/.test(html)) {
    console.warn('⚠️  index.html does not reference a bundled /_astro/*.css sheet');
  }
}

console.log('✅ Post-build complete');
