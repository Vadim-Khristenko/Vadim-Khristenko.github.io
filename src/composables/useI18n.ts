import { computed } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';
import { ru } from '@/i18n/translations/ru/index';
import { en } from '@/i18n/translations/en/index';
import { zh } from '@/i18n/translations/zh/index';

const translations = { ru, en, zh } as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof ru;

/** A value that is either a single string or a per-locale map. */
export type Localized = string | Partial<Record<Locale, string>>;

export function resolveLocalized(value: Localized | undefined, locale: Locale): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value.ru ?? value.en ?? value.zh ?? '';
}

export function useI18n() {
  const store = usePreferencesStore();

  const locale = computed(() => store.locale as Locale);

  const t = computed(() => {
    return (key: TranslationKey, fallback?: string): string => {
      const currentTranslations = translations[locale.value] || translations.ru;
      return currentTranslations[key] || fallback || key;
    };
  });

  /** Resolve a Localized value (string | {ru,en,zh}) against the current locale. */
  const tl = computed(() => (value: Localized | undefined): string =>
    resolveLocalized(value, locale.value)
  );

  /**
   * Plural-aware translate. Picks the CLDR plural category for the current
   * locale (`one` / `few` / `many` / `other`) and looks up `${key}.${category}`,
   * falling back to `${key}.other` then the flat `${key}`. Russian gets correct
   * 1 / 2–4 / 5+ forms; English gets one/other; Chinese always resolves to other.
   */
  const tc = computed(() => (key: string, count: number): string => {
    const dict = (translations[locale.value] || translations.ru) as Record<string, string>;
    const cat = new Intl.PluralRules(locale.value).select(count);
    return dict[`${key}.${cat}`] ?? dict[`${key}.other`] ?? dict[key] ?? key;
  });

  /** A translation key resolved in EVERY locale — used to build search haystacks. */
  const tAll = (key: string): string[] =>
    (Object.keys(translations) as Locale[])
      .map((l) => (translations[l] as Record<string, string>)[key])
      .filter(Boolean);

  const availableLocales = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  function setLocale(newLocale: Locale) {
    store.setLocale(newLocale);
  }

  return {
    locale,
    t: t.value,
    tl: tl.value,
    tc: tc.value,
    tAll,
    availableLocales,
    setLocale,
  };
}