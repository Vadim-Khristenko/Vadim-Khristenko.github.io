import { Trophy, Medal, GraduationCap, Users, Swords } from 'lucide-vue-next';
import type { Achievement } from './types';

/**
 * ACHIEVEMENTS — wins & milestones. Copy an object to add one.
 * Text is inline {ru,en,zh}; `image` (a logo/badge) takes priority over `icon`.
 */
export const achievements: Achievement[] = [
  {
    title: { ru: 'Победитель олимпиады PROD', en: 'Winner of the PROD olympiad', zh: 'PROD 奥林匹克冠军' },
    desc: {
      ru: 'Международная олимпиада по промышленной разработке (Т-Технологии · Центральный университет · ВШЭ).',
      en: 'International software-engineering olympiad (T-Technologies · Central University · HSE).',
      zh: '国际工业软件开发奥林匹克（T-科技 · 中央大学 · 高等经济大学）。',
    },
    tag: { ru: 'Олимпиада', en: 'Olympiad', zh: '奥林匹克' },
    year: '2026',
    accent: '#F59E0B',
    icon: Trophy,
    image: '/avatars/PROD_Olympiad.png',
    url: 'https://prodcontest.com',
    featured: true,
  },
  {
    title: { ru: 'Финалист «Высшей пробы»', en: 'Finalist of “Higher Trial”', zh: '"高等测试"决赛选手' },
    desc: {
      ru: 'Всероссийская олимпиада школьников от НИУ ВШЭ.',
      en: 'HSE all-Russian school olympiad.',
      zh: '由 HSE 举办的全俄中学生奥林匹克。',
    },
    tag: { ru: 'Олимпиада', en: 'Olympiad', zh: '奥林匹克' },
    accent: '#6366F1',
    icon: Medal,
  },
  {
    title: {
      ru: 'Алгоритмы и структуры данных — Т-Образование, поток B',
      en: 'Algorithms & Data Structures — T-Education, cohort B',
      zh: '算法与数据结构 —— T-教育 B 班',
    },
    desc: {
      ru: 'Прошёл углублённый курс по алгоритмам и структурам данных.',
      en: 'Completed the advanced algorithms & data-structures course.',
      zh: '完成算法与数据结构进阶课程。',
    },
    tag: { ru: 'Курс', en: 'Course', zh: '课程' },
    accent: '#FB923C',
    icon: GraduationCap,
    image: '/avatars/T_Education.png',
  },
  {
    title: { ru: 'Вёл свой кружок по программированию', en: 'Ran my own coding club', zh: '主持自己的编程社团' },
    desc: {
      ru: 'Учил ребят программировать и собирать первые проекты.',
      en: 'Taught kids to code and ship their first projects.',
      zh: '教孩子们编程，做出他们的第一个项目。',
    },
    tag: { ru: 'Наставничество', en: 'Mentorship', zh: '指导' },
    accent: '#34D399',
    icon: Users,
  },
  {
    title: { ru: 'Бросал вызов крупным корпорациям — и не раз', en: 'Challenged big corporations — more than once', zh: '不止一次挑战大公司' },
    desc: {
      ru: 'Отстаивал свои идеи и проекты, когда их пытались задавить.',
      en: 'Stood up for my ideas and projects when they were being crushed.',
      zh: '当我的想法和项目被打压时，挺身捍卫。',
    },
    tag: { ru: 'Характер', en: 'Grit', zh: '骨气' },
    accent: '#EF4444',
    icon: Swords,
  },
];
