import type { Inspiration } from './types';

/**
 * "Not friends yet" — people Vadim is inspired by and would love to befriend one day.
 * Add anyone: streamers, founders, engineers… Copy an object and fill the fields.
 * Fields mirror Friend: name (string | {ru,en,zh}), role, desc, avatar, banner,
 * accent, tags, socials, website.
 */
export const inspirations: Inspiration[] = [
  {
    name: 'Filian',
    role: { ru: 'VTuber · энтертейнер', en: 'VTuber · entertainer', zh: 'VTuber · 娱乐主播' },
    desc: {
      ru: 'За искренность, самоиронию и умение превращать хаос в тёплое, живое сообщество.',
      en: 'For the sincerity, self-irony and turning pure chaos into a warm, living community.',
      zh: '因为她的真诚、自嘲，以及把混乱变成温暖社区的能力。',
    },
    accent: '#FF5FA2',
    avatar: '/avatars/Filian_VTUBER.png',
    tags: ['VTuber', 'Twitch'],
    socials: [
      { kind: 'twitch', url: 'https://twitch.tv/filian' },
      { kind: 'youtube', url: 'https://youtube.com/@filian' },
      { kind: 'website', url: 'https://linktr.ee/filianVT', label: { ru: 'Ссылки', en: 'Links', zh: '链接' } },
    ],
  },
  {
    name: 'Sam Altman',
    role: { ru: 'CEO OpenAI', en: 'CEO of OpenAI', zh: 'OpenAI 首席执行官' },
    desc: {
      ru: 'За масштаб мышления и веру в то, что технологии могут поднять планку для всех.',
      en: 'For the scale of thinking and the belief that technology can raise the floor for everyone.',
      zh: '因为其思维的格局，以及相信技术能为所有人抬高下限。',
    },
    accent: '#10A37F',
    avatar: '/avatars/Sam_Altman.png',
    tags: ['AI'],
    socials: [
      { kind: 'x', url: 'https://x.com/sama' },
      { kind: 'website', url: 'https://blog.samaltman.com', label: { ru: 'Блог', en: 'Blog', zh: '博客' } },
    ],
  },
  {
    name: 'Dario Amodei',
    role: { ru: 'сооснователь и CEO Anthropic', en: 'Co-founder & CEO of Anthropic', zh: 'Anthropic 联合创始人兼 CEO' },
    desc: {
      ru: 'За то, что делает мощный ИИ, не забывая про безопасность и ответственность.',
      en: 'For building powerful AI while keeping safety and responsibility at the centre.',
      zh: '因为在打造强大 AI 的同时，把安全与责任放在核心。',
    },
    accent: '#D97757',
    avatar: '/avatars/Dario_Amodei.png',
    tags: ['AI', 'Safety'],
    website: 'https://www.anthropic.com',
    socials: [
      { kind: 'website', url: 'https://darioamodei.com', label: { ru: 'Эссе', en: 'Essays', zh: '文章' } },
      { kind: 'x', url: 'https://x.com/AnthropicAI', label: 'Anthropic' },
    ],
  },
  {
    name: 'Elon Musk',
    role: { ru: 'Tesla · SpaceX · xAI', en: 'Tesla · SpaceX · xAI', zh: 'Tesla · SpaceX · xAI' },
    desc: {
      ru: 'За смелость ставить абсурдно большие цели и всё равно доводить их до запуска.',
      en: 'For the nerve to set absurdly large goals and still ship them to launch.',
      zh: '因为敢于设定荒谬的大目标，并最终把它们送上发射台。',
    },
    accent: '#5A6570',
    avatar: '/avatars/Elon_Musk.png',
    tags: ['Space', 'Engineering'],
    socials: [{ kind: 'x', url: 'https://x.com/elonmusk' }],
  },
];
