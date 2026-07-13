import type { Friend } from './types';

/**
 * FRIENDS — easy to extend.
 *
 * To add a friend, copy the template below and drop it into the array.
 * `tier: 'best'` pins them to the highlighted "best friends" row.
 *
 *   {
 *     name: 'Name',
 *     role: { ru: 'роль', en: 'role', zh: '角色' },   // or just 'role'
 *     desc: 'a short line about them',                 // or { ru, en, zh }
 *     avatar: 'https://…/avatar.png',                  // optional image
 *     accent: '#FF6B9D',                               // card accent
 *     tier: 'best',                                    // 'best' | 'friend'
 *     website: 'https://…',
 *     socials: [
 *       { kind: 'telegram', url: 'https://t.me/…' },
 *       { kind: 'github',   url: 'https://github.com/…' },
 *       { kind: 'discord',  url: 'https://discord.com/users/…' },
 *     ],
 *   },
 */
export const friends: Friend[] = [
  {
    name: { ru: 'Маша (Rice)', en: 'Masha (Rice)', zh: '玛莎 (Rice)' },
    roleKey: 'friends.masha.role',
    descKey: 'friends.masha.desc',
    avatar: '/avatars/Masha_Rice.png',
    accent: '#F472B6',
    badge: 'MUSE',
    tier: 'best',
    birthday: '2010-07-13',
    socials: [
      { kind: 'telegram', url: 'https://t.me/r_4d10' },
    ],
  },
  {
    name: { ru: 'Раффи Мартиросян', en: 'Raffi Martirosyan', zh: '拉菲·马尔季罗相' },
    roleKey: 'friends.raffi.role',
    descKey: 'friends.raffi.desc',
    // no photo yet → shows the PHOTO_NOT_FOUND placeholder
    accent: '#60A5FA',
    badge: 'DAY ONE',
    tier: 'friend',
    birthday: '2010-07-23',
  },
  {
    name: { ru: 'Миша Казарновский', en: 'Misha Kazarnovsky', zh: '米沙·卡扎尔诺夫斯基' },
    roleKey: 'friends.misha.role',
    descKey: 'friends.misha.desc',
    avatar: '/avatars/MishaKaz_Mishkka404.png',
    accent: '#34D399',
    badge: 'SINCE SCHOOL',
    tier: 'best',
    birthday: '2010-07-18',
    socials: [
      { kind: 'telegram', url: 'https://t.me/Mishkka404' },
    ],
  },
  {
    name: { ru: 'Юрий Кузнецов', en: 'Yuriy Kuznetsov', zh: '尤里·库兹涅佐夫' },
    roleKey: 'friends.yuriy.role',
    descKey: 'friends.yuriy.desc',
    avatar: '/avatars/YuriyKuz_Ukuznecov.png',
    accent: '#FBBF24',
    badge: 'SINCE SCHOOL',
    tier: 'best',
    birthday: '2010-11-16',
    socials: [
      { kind: 'telegram', url: 'https://t.me/Ukuznecov' },
    ],
  },
  {
    name: { ru: 'Семён (Ekevoki)', en: 'Semyon (Ekevoki)', zh: '谢苗 (Ekevoki)' },
    roleKey: 'friends.ekevoki.role',
    descKey: 'friends.ekevoki.desc',
    avatar: '/avatars/Semen_Ekevoki.png',
    accent: '#A78BFA',
    badge: 'DEV',
    tier: 'best',
    birthday: '2009-10-23',
    socials: [
      { kind: 'telegram', url: 'https://t.me/Official_EkeVoki' },
      { kind: 'github', url: 'https://github.com/EkeVoki' },
    ],
  },
  {
    name: { ru: 'Илья (Tapeline)', en: 'Ilya (Tapeline)', zh: '伊利亚 (Tapeline)' },
    roleKey: 'friends.ilya.role',
    descKey: 'friends.ilya.desc',
    accent: '#14B8A6',
    avatar: '/avatars/Ilya_Tapeline.png',
    badge: 'KUMIR SPARK',
    tier: 'best',
    birthday: '2008-03-17',
    tags: ['Open Source', 'Rust'],
    website: 'https://tapeline.dev/',
    socials: [
      { kind: 'telegram', url: 'https://t.me/tapeline_tg', labelKey: 'friends.link.personal' },
      { kind: 'telegram', url: 'https://t.me/http_418_i_am_a_teapot', labelKey: 'friends.link.channel' },
      { kind: 'github', url: 'https://github.com/Tapeline' },
      { kind: 'link', url: 'https://habr.com/ru/users/tapeline/', label: 'Habr' },
    ],
  },
  {
    name: { ru: 'Кайто', en: 'Kaito', zh: '海斗' },
    roleKey: 'friends.kaito.role',
    descKey: 'friends.kaito.desc',
    accent: '#0DBD8B',
    avatar: '/avatars/Kaito.png',
    badge: 'EXTERA',
    tier: 'friend',
    age: 16,
    tags: ['Matrix', 'Rust'],
    website: 'https://rustyraven.pw/',
    socials: [
      { kind: 'telegram', url: 'https://t.me/xynfn' },
      { kind: 'matrix', url: 'https://matrix.to/#/@rustyraven:extera.xyz', label: 'Matrix' },
      { kind: 'github', url: 'https://github.com/ryotairi' },
      { kind: 'website', url: 'https://extera.xyz/', label: 'Extera' },
    ],
  },
  {
    name: { ru: 'Миша (misshanya)', en: 'Misha (misshanya)', zh: '米沙 (misshanya)' },
    roleKey: 'friends.misshanya.role',
    descKey: 'friends.misshanya.desc',
    accent: '#00ADD8',
    avatar: '/avatars/Misha_misshanya.png',
    badge: 'HUGS',
    tier: 'best',
    birthday: '2009-07-17',
    tags: ['Go', 'DevOps'],
    website: 'https://misshanya.ru',
    socials: [
      { kind: 'github', url: 'https://github.com/misshanya' },
      { kind: 'link', url: 'https://проднимашки.рф', label: 'Проднимашки.рф' },
    ],
  },
  {
    name: { ru: 'Пакоё (paqoe)', en: 'paqoe', zh: 'paqoe' },
    roleKey: 'friends.paqoe.role',
    descKey: 'friends.paqoe.desc',
    accent: '#8B5CF6',
    avatar: '/avatars/Paqoe.png',
    badge: 'CU',
    tags: ['PROD', 'YandexCon'],
    tier: 'friend',
    socials: [
      { kind: 'telegram', url: 'https://t.me/paqoe', labelKey: 'friends.link.personal' },
      { kind: 'telegram', url: 'https://t.me/paqoech', labelKey: 'friends.link.channel' },
    ],
  },
];
