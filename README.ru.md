<div align="center">

# vai-rice.space

**Личный сайт Вадима Христенко — он же VAI_PROG.**
Разработчик · бот-мейкер · опенсорс-активист. Системный код, Rust и интерфейсы, которые не похожи на остальные.

[English](README.md) · **Русский** · [中文](README.zh.md)

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fvai-rice.space&label=vai-rice.space)](https://vai-rice.space)
[![Stars](https://img.shields.io/github/stars/Vadim-Khristenko/Vadim-Khristenko.github.io?style=flat&logo=github)](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/Vadim-Khristenko/Vadim-Khristenko.github.io)](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/commits)
[![Astro](https://img.shields.io/badge/Astro-4-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![Rust](https://img.shields.io/badge/Rust-WASM-dea584?logo=rust&logoColor=white)](https://www.rust-lang.org)

</div>

---

## Что это

Трёхъязычное (🇬🇧 / 🇷🇺 / 🇨🇳) одностраничное портфолио с **8 полностью разными темами** — каждая это настоящий *опыт*, а не перекраска — плюс набор самостоятельных мини-приложений, написанных с нуля на **Rust → WebAssembly**.

## ✨ Ключевое

- **8 тем**, у каждой свои шрифты, движение и пасхалки: Modern (швейцарская редактура), Snackers, Windows 11, macOS 26, **Windows 95**, **Mac Classic**, Classic (2016–18), Terminal — со светлым/тёмным режимом там, где уместно.
- **Три языка** (ru / en / zh) через тонкий i18n-слой, разбитый на файлы по секциям — удобно редактировать.
- **Тема-осознанный блог** с поиском, тегами, прогрессом чтения и локализацией постов.
- Data-driven секции **Projects / Labs / Friends / Inspirations / Communities / Achievements** — добавить запись = скопировать объект.
- **Живая статистика GitHub**, обновляемая кроном (ниже) — звёзды, форки и разбивка по языкам всегда актуальны.
- Машиночитаемый профиль для ИИ-агентов: [`/llms.txt`](https://vai-rice.space/llms.txt) и [`/for-ai/`](https://vai-rice.space/for-ai/AGENTS.md).

## 🧪 Лаба — мини-приложения (Rust + Leptos → WASM)

| Приложение | Что это | Открыть |
|-----------|---------|---------|
| **Horizon 2027** | Интерактивный разветвлённый новогодний опыт с живым отсчётом (григорианский **и** китайский НГ). | [/files/horizon](https://vai-rice.space/files/horizon/) |
| **JustCode** | Превращает код в красивые картинки — темы, оконный хром, PNG/JPEG/WebP/SVG, сохранение пресетов. | [/files/justcode](https://vai-rice.space/files/justcode/) |
| **VAI Terminal** | Портфолио-командная строка с записываемой виртуальной ФС; понимает bash **и** PowerShell. | [/files/terminal](https://vai-rice.space/files/terminal/) |

Каждая лаба живёт в `projects/<name>/` и собирается через `trunk build --release` прямо в `public/files/<name>/`.

## 🛠 Технологии

**Сайт:** Astro 4 · Vue 3 + Pinia · TypeScript · Tailwind · модульные CSS-темы на токенах.
**Лаба:** Rust · Leptos 0.6 (CSR) · Trunk · WebAssembly.
**Инфра:** GitHub Actions (деплой · синк лейблов · крон статистики) · Dependabot · GitHub Pages + Cloudflare DNS.

## 📊 Живая статистика

`.github/workflows/stats.yml` запускает `scripts/update-stats.mjs` каждые 6 часов (и по кнопке). Скрипт тянет GitHub API, собирает **суммарные звёзды / форки**, **разбивку по языкам (по байтам)** и **статистику по репозиториям**, затем коммитит `public/data/stats.json`. Сайт читает этот JSON в рантайме — цифры свежие, без запросов на каждого посетителя и без лимитов. Данные публичны: [`/data/stats.json`](https://vai-rice.space/data/stats.json).

## 🗂 Структура

```
src/
  components/sections/   # по одному Vue-компоненту на секцию страницы
  data/                  # редактируемые данные (projects, labs, friends, achievements, …)
  i18n/translations/     # ru/ en/ zh — по файлу на секцию, собираются в index.ts
  styles/themes/         # по одному CSS-файлу на тему
projects/{horizon,justcode,terminal}/   # мини-приложения на Rust/WASM
scripts/update-stats.mjs # генератор статистики GitHub (крон)
public/                  # статика, CNAME, фавиконы, /data/stats.json
```

## 🚀 Разработка

```bash
bun install
bun run dev        # локальный dev
bun run build      # → dist/
bun run verify     # проверка внутренних ссылок
```

Собрать лабу:

```bash
rustup target add wasm32-unknown-unknown   # один раз
cargo install trunk --locked               # один раз
cd projects/horizon && trunk build --release
```

## 🌍 Деплой

Пуш в `main` (или коммит крона статистики) запускает **GitHub Actions → GitHub Pages**. Кастомный домен `vai-rice.space` через `public/CNAME` + Cloudflare DNS (только DNS). Источник Pages — *GitHub Actions*.

## 🤝 Вклад

Знаешь сообщество или человека, которым тут место? Заполни трёхъязычную issue-форму:
[предложить сообщество](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/issues/new?template=suggest-community.yml) ·
[добавить друга](https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/issues/new?template=suggest-friend.yml).

## 📜 Лицензия

**VKPPL v1.0** — *Vadim Khristenko Personal Project License*. См. [LICENSE](LICENSE).

- ✅ **Некоммерческое использование** — разрешено всем.
- ❌ **Коммерческое использование** — только по согласованию.
- ❌ **Обучение AI / ML** на этом коде или контенте — запрещено.

## 📇 Контакты

**business@vai-rice.space** · [vai-rice.space](https://vai-rice.space) · [github.com/Vadim-Khristenko](https://github.com/Vadim-Khristenko)
