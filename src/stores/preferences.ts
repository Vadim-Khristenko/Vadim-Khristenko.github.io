import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ThemeMode, ColorMode, UserPreferences } from '@/types/theme';

const STORAGE_KEY = 'vai-prog-preferences';

function defaultPreferences(): UserPreferences {
  return {
    name: '',
    theme: 'modern',
    colorMode: 'auto',
    locale: 'ru',
    firstVisit: true,
    easterEggsFound: [],
  };
}

function loadPreferences(): UserPreferences {
  const defaults = defaultPreferences();
  if (typeof window === 'undefined') return defaults;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // merge so new keys (e.g. colorMode) get sane defaults for old visitors
      return { ...defaults, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load preferences:', e);
  }
  return defaults;
}

function savePreferences(prefs: UserPreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn('Failed to save preferences:', e);
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const preferences = ref<UserPreferences>(loadPreferences());

  const theme = computed(() => preferences.value.theme);
  const colorMode = computed(() => preferences.value.colorMode);
  const locale = computed(() => preferences.value.locale);
  const userName = computed(() => preferences.value.name);
  const isFirstVisit = computed(() => preferences.value.firstVisit);
  const easterEggsFound = computed(() => preferences.value.easterEggsFound);

  const isMikuUnlocked = computed(() => 
    preferences.value.easterEggsFound.includes('miku')
  );

  function setTheme(newTheme: ThemeMode) {
    preferences.value.theme = newTheme;
    applyTheme(newTheme);
    savePreferences(preferences.value);
  }

  function applyColorMode(mode: ColorMode) {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-mode', mode);
  }

  function setColorMode(mode: ColorMode) {
    preferences.value.colorMode = mode;
    applyColorMode(mode);
    savePreferences(preferences.value);
  }

  /** Cycle auto → light → dark → auto (used by the Modern mode toggle). */
  function cycleColorMode() {
    const order: ColorMode[] = ['auto', 'light', 'dark'];
    const next = order[(order.indexOf(preferences.value.colorMode) + 1) % order.length];
    setColorMode(next);
  }

  function setName(name: string) {
    preferences.value.name = name;
    savePreferences(preferences.value);
  }

  function setLocale(locale: string) {
    preferences.value.locale = locale;
    savePreferences(preferences.value);
  }

  function markVisited() {
    preferences.value.firstVisit = false;
    savePreferences(preferences.value);
  }

  function findEasterEgg(eggId: string) {
    if (!preferences.value.easterEggsFound.includes(eggId)) {
      preferences.value.easterEggsFound.push(eggId);
      savePreferences(preferences.value);
    }
  }

  function applyTheme(themeMode: ThemeMode) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    
    const themeColors: Record<ThemeMode, { bg: string; accent: string }> = {
      modern: { bg: '#F3F1EC', accent: '#1E2AFF' },
      win11: { bg: '#202020', accent: '#0078D4' },
      macos26: { bg: '#000000', accent: '#A78BFA' },
      win95: { bg: '#008080', accent: '#000080' },
      macclassic: { bg: '#F5F5DC', accent: '#000000' },
      snackers: { bg: '#0D0618', accent: '#FF6B9D' },
      classic: { bg: '#FAFAF9', accent: '#4F46E5' },
      terminal: { bg: '#1A1B26', accent: '#39C5BB' },
    };

    const colors = themeColors[themeMode];
    if (colors) {
      root.style.setProperty('--theme-bg', colors.bg);
      root.style.setProperty('--theme-accent', colors.accent);
    }
  }

  function init() {
    applyTheme(preferences.value.theme);
    applyColorMode(preferences.value.colorMode);
  }

  return {
    preferences,
    theme,
    colorMode,
    locale,
    userName,
    isFirstVisit,
    easterEggsFound,
    isMikuUnlocked,
    setTheme,
    setColorMode,
    cycleColorMode,
    setName,
    setLocale,
    markVisited,
    findEasterEgg,
    applyTheme,
    applyColorMode,
    init,
  };
});