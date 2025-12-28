import { ui, defaultLang } from './translations';

type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL): Lang {
  const segments = url.pathname.split('/').filter(Boolean);
  const lang = segments[0];
  if (lang && lang in ui) {
    return lang as Lang;
  }
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: string = lang) {
    const isDefault = l === defaultLang;
    const prefix = isDefault ? '' : `/${l}`;
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    // If it's just /, return prefix or /
    if (normalizedPath === '/') return prefix || '/';
    return `${prefix}${normalizedPath}`;
  }
}