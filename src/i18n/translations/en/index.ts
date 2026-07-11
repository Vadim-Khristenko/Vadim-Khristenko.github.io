import { nav } from './nav';
import { welcome } from './welcome';
import { hero } from './hero';
import { about } from './about';
import { skills } from './skills';
import { projects } from './projects';
import { labs } from './labs';
import { featured } from './featured';
import { drops } from './drops';
import { hiring } from './hiring';
import { friends } from './friends';
import { inspirations } from './inspirations';
import { communities } from './communities';
import { contact } from './contact';
import { blog } from './blog';
import { footer } from './footer';
import { common } from './common';
import { achievements } from './achievements';

export const en = {
  ...nav,
  ...welcome,
  ...hero,
  ...about,
  ...skills,
  ...projects,
  ...labs,
  ...featured,
  ...drops,
  ...hiring,
  ...friends,
  ...inspirations,
  ...communities,
  ...contact,
  ...blog,
  ...footer,
  ...common,
  ...achievements,
} as const;
