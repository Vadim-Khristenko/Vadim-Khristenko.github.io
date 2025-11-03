# Vadim-Khristenko.github.io

Современная визитка на Astro + TailwindCSS + React (минимально, только для интерактива). Тёмная тема по умолчанию, красно‑фиолетовый градиент; в VOCALOID MODE — бирюзовый неон и поп‑ап с названием трека.

## Что внутри

- `src/pages/index.astro` — главная страница (Hero, About, Skills, Projects, Art, Friends, Contacts)
- `src/layouts/BaseLayout.astro` — базовый шаблон, мета и стили
- `src/components/Carousel.jsx` — карусель артов (свайп/автоплей, данные из `public/arts/credits.json`)
- `src/components/ModeToggle.jsx` — VOCALOID MODE (проигрывает `/music/Anamanaguchi_Miku-Ft_Hatsune_Miku.mp3`)
- `src/components/FriendsGrid.astro` — карточки друзей (Маша — особенный человек; добавлены Миша Казарновский и Юрий Кузнецов; логотип T‑Образования)
- `src/components/Timeline.astro` — авторская история в виде таймлайна
- `src/pages/blog/` — простой блог: список и Markdown‑посты
- `.github/workflows/deploy.yml` — CI для GitHub Pages

Публичные ассеты лежат в `public/` и доступны по корню `/`:

- `public/arts/*` и `public/arts/credits.json`
- `public/avatars/*`
- `public/music/*`
- `public/favicon/*`

## Локально

```pwsh
npm install
npm run dev
```

Сборка и предпросмотр:

```pwsh
npm run build
npm run preview
```

## Как добавить арты

1) Положите изображения в `public/arts/` (желательно нумерация: 1.jpg, 2.jpg ...)
2) Добавьте запись в `public/arts/credits.json` с тем же именем файла.

Порядок — по номеру файла. Подписи формируются автоматически.

## VOCALOID MODE

Переключатель в шапке. При включении — неоновая палитра и поп‑ап с названием трека. Трек берётся из `public/music/` (есть fallback на старый путь `/assets/…`).

## Лицензия

### VKPPL v1.0 (Vadim Khristenko Personal Project License)

✅ Non-commercial use — разрешено для всех
❌ Commercial use — запрещено
❌ AI/ML training — запрещено
❌ Использование для прибыли — запрещено

Подробнее см. файл `LICENSE`.

Для коммерческого использования свяжитесь с автором.
