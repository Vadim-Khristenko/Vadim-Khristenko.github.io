import { Rocket, ImageDown, SquareTerminal } from 'lucide-vue-next';
import type { Lab } from './types';

/**
 * Mini-apps ("Labs") — self-contained pages under /files/*, each built from
 * scratch in Rust + Leptos → WebAssembly, each with its own visual identity.
 * Add one by copying an object below.
 */
export const labs: Lab[] = [
  {
    name: 'Horizon 2027',
    url: '/files/horizon/index.html',
    kind: 'fun',
    accent: '#8b5cf6',
    image: '/favicon/horizon/web-app-manifest-512x512.png',
    icon: Rocket,
    tagline: {
      ru: 'Интерактивный опыт к Новому году',
      en: 'An interactive New Year experience',
      zh: '一场互动的新年体验',
    },
    desc: {
      ru: 'Разветвлённое путешествие с выбором пути и живым отсчётом до Нового года — григорианского и китайского (丁未).',
      en: 'A branching journey with choices and a live countdown to the New Year — Gregorian and Chinese (丁未).',
      zh: '一段带有分支选择的旅程，实时倒数新年 —— 公历与农历（丁未）。',
    },
    stack: ['Rust', 'Leptos', 'WASM'],
  },
  {
    name: 'JustCode',
    url: '/files/justcode/index.html',
    kind: 'utility',
    accent: '#10b3a2',
    image: '/favicon/justcode/web-app-manifest-512x512.png',
    icon: ImageDown,
    tagline: {
      ru: 'Красивые скриншоты кода',
      en: 'Beautiful code screenshots',
      zh: '优美的代码截图',
    },
    desc: {
      ru: 'Превращает исходный код в аккуратные картинки: темы, оконный хром, экспорт в PNG / JPEG / WebP / SVG. Пресеты сохраняются.',
      en: 'Turns source code into crisp images: themes, window chrome, export to PNG / JPEG / WebP / SVG. Presets are saved.',
      zh: '把源代码变成精致的图片：主题、窗口样式，导出 PNG / JPEG / WebP / SVG。预设会被保存。',
    },
    stack: ['Rust', 'Leptos', 'WASM'],
  },
  {
    name: 'VAI Terminal',
    url: '/files/terminal/index.html',
    kind: 'fun',
    accent: '#e0475e',
    image: '/favicon/terminal/web-app-manifest-512x512.png',
    icon: SquareTerminal,
    tagline: {
      ru: 'Портфолио как командная строка',
      en: 'A portfolio as a command line',
      zh: '命令行式的作品集',
    },
    desc: {
      ru: 'Исследуй меня как файловую систему: понимает bash и PowerShell, умеет создавать файлы и всё сохраняет. Ретро-CRT.',
      en: 'Explore me like a filesystem: speaks bash and PowerShell, lets you create files and saves everything. Retro CRT.',
      zh: '像文件系统一样探索我：支持 bash 与 PowerShell，可创建文件并保存一切。复古 CRT。',
    },
    stack: ['Rust', 'Leptos', 'WASM'],
  },
];
