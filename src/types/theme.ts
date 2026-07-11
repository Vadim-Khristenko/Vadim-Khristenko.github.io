export type ThemeMode = 
  | 'modern' 
  | 'win11' 
  | 'macos26' 
  | 'win95' 
  | 'macclassic' 
  | 'snackers' 
  | 'classic'
  | 'terminal';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  nameRu: string;
  nameEn: string;
  nameZh: string;
  description: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionZh: string;
  audience: string;
  audienceRu: string;
  audienceEn: string;
  audienceZh: string;
  icon: string;
  color: string;
  bgColor: string;
  accentColor: string;
  previewClass: string;
}

/** Light/dark mode for themes that support it (currently Modern). */
export type ColorMode = 'auto' | 'light' | 'dark';

export interface UserPreferences {
  name: string;
  theme: ThemeMode;
  colorMode: ColorMode;
  locale: string;
  firstVisit: boolean;
  easterEggsFound: string[];
}