import { Rocket, GraduationCap, Users, BookOpen, Code2, Terminal } from 'lucide-vue-next';
import type { Community } from './types';

/**
 * COMMUNITIES & PLATFORMS — easy to extend.
 *
 * To add one, copy the template below. `icon` is any lucide-vue-next icon
 * (import it above); `avatar` (image URL) takes priority over `icon`.
 *
 *   {
 *     name: 'Community',
 *     desc: { ru: '…', en: '…', zh: '…' },   // or a plain string
 *     accent: '#F87171',
 *     icon: Rocket,                          // or avatar: 'https://…'
 *     badge: 'LABEL',
 *     kind: 'community',                     // 'community' | 'platform'
 *     website: 'https://…',
 *     socials: [{ kind: 'telegram', url: 'https://t.me/…' }],
 *   },
 */
export const communities: Community[] = [
  {
    name: { ru: 'Сообщество PROD', en: 'PROD Community', zh: 'PROD 社区' },
    descKey: 'communities.prod.desc',
    accent: '#F87171',
    kind: 'community',
    badge: 'PROOOOOD',
    avatar: '/avatars/PROD_Olympiad.png',
    icon: Rocket,
    website: 'https://prodcontest.com',
    socials: [
      { kind: 'telegram', url: 'https://t.me/t_prod', label: { ru: 'Офиц. Telegram (RU)', en: 'Official Telegram (RU)', zh: '官方 Telegram (RU)' } },
      { kind: 'telegram', url: 'https://t.me/prod_olympiad', label: { ru: 'Офиц. Telegram (EN)', en: 'Official Telegram (EN)', zh: '官方 Telegram (EN)' } },
    ],
  },
  {
    name: { ru: 'Т-Образование', en: 'T-Education', zh: 'T 教育' },
    descKey: 'communities.tbank.desc',
    accent: '#FB923C',
    kind: 'community',
    badge: 'T-EDU',
    avatar: '/avatars/T_Education.png',
    icon: GraduationCap,
    website: 'https://education.tbank.ru',
  },
  {
    name: { ru: 'Сообщество Фоксфорд', en: 'Foxford Community', zh: 'Foxford 社区' },
    descKey: 'communities.foxford.desc',
    accent: '#9CA3AF',
    kind: 'community',
    badge: '☢️ TOXIC',
    avatar: '/avatars/Foxford_Trash.png',
    icon: BookOpen,
    website: 'https://foxford.ru',
  },
  {
    name: { ru: 'GitHub Open Source', en: 'GitHub Open Source', zh: 'GitHub 开源' },
    descKey: 'communities.github.desc',
    accent: '#8B949E',
    kind: 'platform',
    avatar: '/avatars/GitHub_Community.png',
    icon: Code2,
    website: 'https://github.com/Vadim-Khristenko',
    socials: [{ kind: 'github', url: 'https://github.com/Vadim-Khristenko' }],
  },
  {
    name: { ru: 'Telegram Dev', en: 'Telegram Dev', zh: 'Telegram 开发' },
    descKey: 'communities.tgdev.desc',
    accent: '#26A5E4',
    kind: 'platform',
    avatar: '/avatars/Telegram_Community.png',
    icon: Terminal,
    website: 'https://telegram.org',
    socials: [{ kind: 'telegram', url: 'https://t.me/vscreator_life', label: { ru: 'Канал VAI', en: "VAI's channel", zh: 'VAI 的频道' } }],
  },
  {
    name: 'Snackers',
    descKey: 'communities.snackers.desc',
    accent: '#FF6B9D',
    kind: 'community',
    badge: 'FILIAN',
    avatar: '/avatars/Snackers_VTUBER_Community.png',
    icon: Users,
    website: 'https://snackers.vai-rice.space',
    socials: [
      { kind: 'twitch', url: 'https://twitch.tv/filian', label: { ru: 'Канал Filian', en: 'Filian channel', zh: 'Filian 频道' } },
      { kind: 'youtube', url: 'https://youtube.com/@filian', label: { ru: 'Канал Filian', en: 'Filian channel', zh: 'Filian 频道' } },
      { kind: 'discord', url: 'https://discord.gg/filian', label: { ru: 'Snackers HQ', en: 'Snackers HQ', zh: 'Snackers 总部' } },
      { kind: 'discord', url: 'https://discord.gg/snackersru', label: { ru: 'Snackers RU', en: 'Snackers RU', zh: 'Snackers 俄语区' } },
    ],
  },
];
