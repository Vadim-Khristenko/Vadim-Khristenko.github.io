import type { Localized } from '@/composables/useI18n';

/**
 * Editable data model for Friends / Communities / Projects.
 *
 * Everything here is designed to be trivial to extend: to add an entity,
 * copy an object and fill the fields. Text fields accept EITHER a plain
 * string (quick, one language) OR a { ru, en, zh } map (localized).
 * Existing entries may instead point at an i18n key via *Key for the
 * translations that already live in src/i18n/translations.
 */

export type SocialKind =
  | 'github' | 'telegram' | 'discord' | 'twitter' | 'x' | 'youtube'
  | 'twitch' | 'website' | 'email' | 'instagram' | 'tiktok' | 'vk'
  | 'matrix' | 'link';

export interface Social {
  kind: SocialKind;
  url: string;
  /** optional chip text — string OR {ru,en,zh} */
  label?: Localized;
  /** i18n key alternative to `label` (for shared/reused labels) */
  labelKey?: string;
}

export interface Friend {
  /** display name — string OR {ru,en,zh} (e.g. Filian / Филиан / 菲莉安) */
  name: Localized;
  /** short banner image URL shown at the top of the card */
  banner?: string;
  /** small category chips — string[] or {ru,en,zh}[] */
  tags?: Localized[];
  /** role/title — string, {ru,en,zh}, or leave empty */
  role?: Localized;
  /** i18n key alternative to `role` (for already-translated entries) */
  roleKey?: string;
  desc?: Localized;
  descKey?: string;
  /** avatar image URL; if omitted, the first letter is used */
  avatar?: string;
  /** hex accent color for the card */
  accent?: string;
  /** 'best' = highlighted best friend; default 'friend' */
  tier?: 'best' | 'friend';
  /** small punchy badge chip shown by the name — string OR {ru,en,zh} */
  badge?: Localized;
  /** ISO date 'YYYY-MM-DD' — if set, age is computed & shown live */
  birthday?: string;
  /** explicit age; used only when `birthday` is absent */
  age?: number;
  /** where they're based — string or {ru,en,zh} */
  location?: Localized;
  socials?: Social[];
  /** convenience: a primary website (also rendered as a social) */
  website?: string;
}

export interface Community {
  /** display name — string OR {ru,en,zh} */
  name: Localized;
  desc?: Localized;
  descKey?: string;
  accent?: string;
  /** lucide-vue-next icon component (import it in the data file) */
  icon?: unknown;
  /** avatar/logo image URL (takes priority over `icon`) */
  avatar?: string;
  /** wide banner image URL shown at the top of the card */
  banner?: string;
  badge?: string;
  kind?: 'community' | 'platform';
  /** small category chips — string[] or {ru,en,zh}[] */
  tags?: Localized[];
  /** approximate member count, e.g. "12k" */
  members?: string;
  socials?: Social[];
  website?: string;
}

/** A self-contained mini-app shipped under /files/* — a handy utility or just for fun. */
export interface Lab {
  name: string;
  /** where it lives, e.g. '/files/horizon/' */
  url: string;
  /** short one-liner shown under the name */
  tagline?: Localized;
  desc?: Localized;
  /** hex accent color for the card */
  accent?: string;
  /** 'utility' = useful tool · 'fun' = just for fun */
  kind?: 'utility' | 'fun';
  /** square logo image (e.g. the project's 512×512 favicon); takes priority over `icon` */
  image?: string;
  /** lucide-vue-next icon component fallback (import it in the data file) */
  icon?: unknown;
  stack?: string[];
}

/** Someone not-a-friend (yet) — a person Vadim is inspired by and would love to meet. */
export interface Inspiration {
  /** display name — string OR {ru,en,zh} */
  name: Localized;
  /** what they're known for */
  role?: Localized;
  /** why they inspire / what you'd love to talk about */
  desc?: Localized;
  avatar?: string;
  banner?: string;
  accent?: string;
  tags?: Localized[];
  socials?: Social[];
  website?: string;
}

/** A win / milestone shown in the Achievements section. */
export interface Achievement {
  title: Localized;
  desc?: Localized;
  /** short category chip, e.g. 'Olympiad' / 'Course' */
  tag?: Localized;
  /** year or period, e.g. '2026' */
  year?: string;
  accent?: string;
  /** lucide-vue-next icon component */
  icon?: unknown;
  /** logo/badge image (takes priority over icon) */
  image?: string;
  /** proof / external link */
  url?: string;
  /** featured = spans wider + brighter */
  featured?: boolean;
}

export type ProjectStatus = 'live' | 'indev' | 'comingsoon' | 'ideation';

export interface Project {
  name: string;
  status: ProjectStatus;
  desc?: Localized;
  descKey?: string;
  accent?: string;
  url?: string;
  github?: string;
  stack?: string[];
  featured?: boolean;
  stars?: number;
  forks?: number;
  language?: string;
}
