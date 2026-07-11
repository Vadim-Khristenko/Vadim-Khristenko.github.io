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
    availableLocales,
    setLocale,
  };
}