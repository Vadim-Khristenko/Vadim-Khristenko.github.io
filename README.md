<div align="center">

# vai-rice.space

**Personal site of Vadim Khristenko — a.k.a. VAI_PROG.**
Developer · bot-maker · open-source activist. Systems code, Rust, and interfaces that don't look like everyone else's.

**English** · [Русский](README.ru.md) · [中文](README.zh.md)

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fvai-rice.space&label=vai-rice.space)](https://vai-rice.space)
[![Stars](https://img.shields.io/github/stars/Vadim-Khristenko/Vadim-Khristenko.github.io?style=flat&logo=github)](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/Vadim-Khristenko/Vadim-Khristenko.github.io)](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/commits)
[![Astro](https://img.shields.io/badge/Astro-4-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![Rust](https://img.shields.io/badge/Rust-WASM-dea584?logo=rust&logoColor=white)](https://www.rust-lang.org)

</div>

---

## What this is

A trilingual (🇬🇧 / 🇷🇺 / 🇨🇳) single-page portfolio with **8 fully distinct themes** — each one a genuine *experience*, not a recolor — plus a set of self-contained mini-apps written from scratch in **Rust → WebAssembly**.

## ✨ Highlights

- **8 themes**, each with its own type, motion and easter eggs: Modern (Swiss editorial), Snackers, Windows 11, macOS 26, **Windows 95**, **Mac Classic**, Classic (2016–18), Terminal — with light/dark toggles where it fits.
- **Trilingual** content (ru / en / zh) via a tiny i18n layer, split into per-section files for easy editing.
- A **theme-aware blog** with search, tags, reading progress and per-post localization.
- Data-driven **Projects / Labs / Friends / Inspirations / Communities / Achievements** — adding an entry is copying one object.
- **Live GitHub stats** refreshed by a cron (see below) — stars, forks and a language breakdown are always current.
- A machine-readable profile for AI agents at [`/llms.txt`](https://vai-rice.space/llms.txt) and [`/for-ai/`](https://vai-rice.space/for-ai/AGENTS.md).

## 🧪 Labs — mini-apps (Rust + Leptos → WASM)

| App | What | Live |
|-----|------|------|
| **Horizon 2027** | Interactive, branching New-Year experience with a live countdown (Gregorian **and** Chinese New Year). | [/files/horizon](https://vai-rice.space/files/horizon/) |
| **JustCode** | Turn source code into beautiful images — themes, window chrome, PNG/JPEG/WebP/SVG, saved presets. | [/files/justcode](https://vai-rice.space/files/justcode/) |
| **VAI Terminal** | An explorable command-line portfolio with a writable virtual filesystem; speaks bash **and** PowerShell. | [/files/terminal](https://vai-rice.space/files/terminal/) |

Each lab lives in `projects/<name>/` and builds with `trunk build --release` straight into `public/files/<name>/`.

## 🛠 Tech

**Site:** Astro 4 · Vue 3 + Pinia · TypeScript · Tailwind · modular CSS token themes.
**Labs:** Rust · Leptos 0.6 (CSR) · Trunk · WebAssembly.
**Infra:** GitHub Actions (deploy · label sync · stats cron) · Dependabot · GitHub Pages + Cloudflare DNS.

## 📊 Live stats

`.github/workflows/stats.yml` runs `scripts/update-stats.mjs` every 6 hours (and on demand). It pulls the GitHub API, aggregates **total stars / forks**, a **language breakdown by bytes** and **per-repo stats**, then commits `public/data/stats.json`. The site reads that JSON at runtime — numbers stay fresh with no per-visitor API calls and no rate limits. The data is public: [`/data/stats.json`](https://vai-rice.space/data/stats.json).

## 🗂 Structure

```
src/
  components/sections/   # one Vue component per page section
  data/                  # editable data (projects, labs, friends, achievements, …)
  i18n/translations/     # ru/ en/ zh — one file per section, merged in index.ts
  styles/themes/         # one CSS file per theme
projects/{horizon,justcode,terminal}/   # Rust/WASM mini-apps
scripts/update-stats.mjs # GitHub stats generator (cron)
public/                  # static assets, CNAME, favicons, /data/stats.json
```

## 🚀 Develop

```bash
bun install
bun run dev        # local dev
bun run build      # → dist/
bun run verify     # internal-link check
```

Build a lab:

```bash
rustup target add wasm32-unknown-unknown   # once
cargo install trunk --locked               # once
cd projects/horizon && trunk build --release
```

## 🌍 Deploy

Pushing to `main` (or the stats cron committing) triggers **GitHub Actions → GitHub Pages**. Custom domain `vai-rice.space` via `public/CNAME` + Cloudflare DNS (DNS-only). Pages source must be set to *GitHub Actions*.

## 🤝 Contributing

Know a community or a person that belongs here? Use the trilingual issue forms:
[suggest a community](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/issues/new?template=suggest-community.yml) ·
[add a friend](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/issues/new?template=suggest-friend.yml).

## 📜 License

**VKPPL v1.0** — *Vadim Khristenko Personal Project License*. See [LICENSE](LICENSE).

- ✅ **Non-commercial use** — allowed for everyone.
- ❌ **Commercial use** — not without permission.
- ❌ **AI / ML training** on this code or content — not allowed.

## 📇 Contact

**business@vai-rice.space** · [vai-rice.space](https://vai-rice.space) · [github.com/Vadim-Khristenko](https://github.com/Vadim-Khristenko)
