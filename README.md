<div align="center">

# vai-rice.space

**Personal site of Vadim Khristenko — a.k.a. VAI_PROG.**
Developer · bot-maker · open-source activist. Systems code, Rust, and interfaces that don't look like everyone else's.

**English** · [Русский](README.ru.md) · [中文](README.zh.md)

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fvai-rice.space&label=vai-rice.space&up_message=online)](https://vai-rice.space)
[![Stars](https://img.shields.io/github/stars/Vadim-Khristenko/Vadim-Khristenko.github.io?style=flat&logo=github)](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/Vadim-Khristenko/Vadim-Khristenko.github.io)](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/commits)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![Rust](https://img.shields.io/badge/Rust-WASM-dea584?logo=rust&logoColor=white)](https://www.rust-lang.org)
[![License](https://img.shields.io/badge/license-VKPPL-4F46E5)](LICENSE)

</div>

---

## What this is

A trilingual (🇬🇧 / 🇷🇺 / 🇨🇳) single-page portfolio with **8 fully distinct themes** — each one a genuine *experience*, not a recolor — plus a set of self-contained mini-apps written from scratch in **Rust → WebAssembly**. No React. No Tailwind. Static HTML with Vue islands only where interactivity earns its keep.

> The full story of the rebuild — dropping React, dropping Tailwind, the Astro 4→7 jump, the domain move, the flaky-internet war — is on the blog: **[Reborn](https://vai-rice.space/blog/reborn/)**.

## ✨ Highlights

- **8 themes**, each with its own type, motion and easter eggs: Modern (Swiss editorial), Snackers, Windows 11, macOS 26, **Windows 95** (with a BSOD egg), **Mac Classic**, Classic (2016–18), Terminal — light/dark where it fits.
- **Astro islands architecture** — the page ships as static HTML; a single `client:only="vue"` mounts the interactive app. State lives in three tiny Pinia stores (theme · mode · locale).
- **Trilingual** content (ru / en / zh) via a hand-rolled i18n layer, split into per-section files, with a build-time key-parity check.
- A **theme-aware blog** with search, tags, reading time and true per-post localization (`translationKey` keeps you on the same article when you switch language).
- A private, author-only **Content Studio** editor (`/editor`) — live Markdown preview, tag chips, auto "last edited" date, export to Markdown/Astro.
- Data-driven **Projects / Labs / Friends / Inspirations / Communities / Achievements** — adding an entry is copying one object.
- **Live GitHub stats** refreshed by a cron (see below): total stars / forks / **followers**, per-repo **stars · forks · open issues+PRs · latest release**, a language breakdown and an estimated **lines-of-code** count.
- Dual **licensing, made explicit** — a human-readable [`/license`](https://vai-rice.space/license) page covering both the code (VKPPL) and the writing (VAI Content License).
- A machine-readable profile for AI agents at [`/llms.txt`](https://vai-rice.space/llms.txt).

## 🧪 Labs — mini-apps (Rust + Leptos → WASM)

| App | What | Live |
|-----|------|------|
| **Horizon 2027** | Interactive, branching New-Year experience with a live countdown (Gregorian **and** Chinese New Year). | [/files/horizon](https://vai-rice.space/files/horizon/) |
| **JustCode** | Turn source code into beautiful images — themes, window chrome, PNG/JPEG/WebP/SVG, saved presets. | [/files/justcode](https://vai-rice.space/files/justcode/) |
| **VAI Terminal** | An explorable command-line portfolio with a writable virtual filesystem; speaks bash **and** PowerShell. | [/files/terminal](https://vai-rice.space/files/terminal/) |

Each lab lives in `projects/<name>/` and builds with `trunk build --release` straight into `public/files/<name>/`.

## 🛠 Tech

**Site:** Astro 7 · Vue 3.5 + Pinia 3 · TypeScript 7 · Vite 8 · modular CSS-token themes (no Tailwind, no CSS framework — just variables and discipline).
**Labs:** Rust · Leptos 0.6 (CSR) · Trunk · WebAssembly.
**Tooling:** Bun · Zod-validated content collections · a custom build-verify test (`tests/build-check.mjs`).
**Infra:** GitHub Actions (deploy · label sync · stats cron, all on the latest action majors) · Dependabot · GitHub Pages + Cloudflare DNS (DNS-only).

## 📊 Live stats

`.github/workflows/stats.yml` runs `scripts/update-stats.mjs` every 6 hours (and on demand). It walks the GitHub API across **every owned repo**, aggregates **total stars / forks / followers**, a **language breakdown by bytes** (with estimated lines of code), and **per-repo stats** — stars, forks, open issues + PRs, and the latest release tag. The result is committed to `public/data/stats.json`; the site reads that JSON at runtime, so numbers stay fresh with **zero per-visitor API calls** and no rate limits. If GitHub's API is down, the site degrades gracefully to the last good snapshot. The data is public: [`/data/stats.json`](https://vai-rice.space/data/stats.json).

## 🗂 Structure

```
src/
  components/sections/   # one Vue component per page section
  data/                  # editable data (projects, labs, friends, achievements, …)
  i18n/translations/     # ru/ en/ zh — one file per section, merged in index.ts
  styles/themes/         # one CSS file per theme
  pages/                 # index · blog · editor · license (Astro)
  content/blog/          # trilingual Markdown posts (Zod-validated)
projects/{horizon,justcode,terminal}/   # Rust/WASM mini-apps
scripts/update-stats.mjs # GitHub stats generator (cron)
tests/build-check.mjs    # build + SEO + i18n-parity + 404 verifier
public/                  # static assets, CNAME, favicons, /data/stats.json, /llms.txt
```

## 🚀 Develop

```bash
bun install
bun run dev        # local dev
bun run build      # → dist/ (runs postbuild)
bun run verify     # build output + SEO + i18n parity + broken-link check
```

Build a lab:

```bash
rustup target add wasm32-unknown-unknown   # once
cargo install trunk --locked               # once
cd projects/horizon && trunk build --release
```

## ✅ Verify

`bun run verify` (after a build) checks the `dist/` output for: required pages & assets, SEO essentials (OG banner, JSON-LD, sitemap, robots, CNAME), that **every blog post exists in ru/en/zh**, that **i18n keys are in parity** across all three languages, and that there are **no broken internal links**. It's the gate the deploy pipeline runs too.

## 🌍 Deploy

Pushing to `main` (or the stats cron committing) triggers **GitHub Actions → GitHub Pages**. Custom domain `vai-rice.space` via `public/CNAME` + Cloudflare DNS (DNS-only). Pages source must be set to *GitHub Actions*.

Check that CI actions are on their latest versions:

```bash
grep -rh 'uses:' .github/workflows | sort -u          # what you pin now
gh api repos/actions/checkout/releases/latest -q .tag_name   # latest upstream tag
```

## 🤝 Contributing

Know a community or a person that belongs here? Use the trilingual issue forms:
[suggest a community](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/issues/new?template=suggest-community.yml) ·
[add a friend](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/issues/new?template=suggest-friend.yml).

## 📜 License

Two licenses, both explained in plain words on the [`/license`](https://vai-rice.space/license) page:

- **Code → VKPPL v1.0** (*Vadim Khristenko Personal Project License*, see [LICENSE](LICENSE)).
- **Writing & posts → VAI Content License (VCL) v1.0** — read, quote and share with a link; no full re-publishing.

For both: ✅ non-commercial use · ❌ commercial use without permission · ❌ AI / ML training on the code or content.

## 📇 Contact

**business@vai-rice.space** · [vai-rice.space](https://vai-rice.space) · [github.com/Vadim-Khristenko](https://github.com/Vadim-Khristenko)
