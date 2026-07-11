---
title: 'Reborn: I nuked my old site and rebuilt it from scratch'
description: 'The story of a big migration: waving goodbye to React and Tailwind, moving to Astro 7 + Vue, eight themes, three Rust/WASM mini-apps and live stats. Lots of code, a little madness.'
pubDate: 2026-07-12
updatedDate: 2026-07-12
author: VAI_PROG
tags: ['reborn', 'migration', 'astro', 'vue', 'rust', 'tailwind']
lang: en
translationKey: reborn
cover: /VAI-BANNER.png
---

You know the feeling when you open an old project and want to both hug it and bury it very deep? Same. The old `vai-rice.space` was cute, but it had grown so many crutches, so much `React` and `Tailwind`, that breathing got hard. So I did the most honest thing you can do with legacy:

> **Deleted everything. Rebuilt it. From scratch.**

This is the story of how one stubborn developer moved to `Astro 7`, threw out React, said goodbye to Tailwind, wrote three mini-apps in Rust — and stayed (mostly) sane.

## 👋 Goodbye, React

Nothing personal. React is great, but for a content site with a pile of unique themes it felt like driving a nail with a microscope. I didn't need a runtime framework on every button — I needed **islands**.

That's how I landed on **Astro + Vue**. Astro ships static HTML (fast, cheap, SEO-friendly), and I hydrate the heavy interactivity precisely, as Vue islands:

```astro
<MainPage client:only="vue" />
```

One `client:only` and the whole SPA experience lives in the browser, while everything else stays clean, lightweight HTML. State lives in `Pinia` (theme, mode, locale). React left — and it got quiet in a good way.

## 🎨 You too, Tailwind

This one was almost therapeutic. I checked honestly: **Tailwind wasn't actually used**. Not a single `md:flex`, not one `@apply`. All styling had long lived on custom CSS variables:

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
```

Each theme just overrides tokens (`--bg`, `--primary`, `--radius`, `--font-display`…) and components read them. So `@astrojs/tailwind` and `tailwindcss` rode off into the sunset. One less dependency, one whole layer of magic gone — and **zero losses**.

## 🚀 Astro 4 → 7: leaping three majors

This is where it got spicy. The project sat on `Astro 4`, and the world was already on **`Astro 7.0.7`**. Between them: a new *content layer*, renamed APIs and a couple of surprises:

- `src/content/config.ts` moved to **`src/content.config.ts`**;
- collections now require a **loader**:

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({ /* … */ }),
});
```

- `post.slug` became `post.id`.

A few edits, a rebuild, and `✓ 6 page(s) built`. I also pulled in **Vue 3.5**, **Pinia 3**, **Vite 8** and even **TypeScript 7**. Living on the edge. 🔪

## 🖥️ Eight themes, eight moods

The site can change outfits. And it's not "swapped the accent color" — it's eight **different experiences**:

- **Modern** — Swiss editorial: cobalt + vermilion, big typography.
- **Windows 95** and **Mac Classic** — pixel-perfect nostalgia, with section-windows and BSOD easter eggs.
- **Windows 11**, **macOS 26**, **Snackers**, **Classic**, **Terminal** — each with its own fonts, motion and secrets.

## 🦀 Three mini-apps in Rust → WebAssembly

Because why not:

- **[Horizon 2027](/files/horizon/)** — an interactive New Year journey with a live countdown (Gregorian **and** Chinese New Year).
- **[JustCode](/files/justcode/)** — turns code into beautiful images (PNG/JPEG/WebP/SVG).
- **[VAI Terminal](/files/terminal/)** — a command-line portfolio with a writable filesystem, speaking bash **and** PowerShell.

All built on `Leptos` and honest WASM.

## 📊 Live stats without the pain

Previously every page hit the GitHub API for each visitor (hello, rate limits). Now a **cron every 6 hours** collects stars, forks and a language breakdown into a public `/data/stats.json`, and the site just reads it. Fast, fresh, drama-free.

## 🧠 The little things that spark joy

- Translations (ru/en/zh) split into **per-section micro-files** — a joy to edit.
- Grown-up SEO: Open Graph with a banner, `JSON-LD`, sitemap, robots.
- A profile for **AI agents**: `/llms.txt` and `/for-ai/`.
- Real brand icons (`simple-icons`) instead of generic ones.

## The takeaway

The old site was a good draft. The new one is what I meant all along: fast, weird, entirely mine. No React. No Tailwind. Rust where nobody asked for it.

> The best way to predict 2027 is to build it yourself. Ideally on the first commit.

Thanks for stopping by. Now I'm off to break and fix something else. 🚀
