<template>
  <div class="ts" :class="{ open: isOpen }">
    <button class="ts-toggle" @click="isOpen = !isOpen" :title="t('welcome.themeTitle')">
      <Palette :size="18" />
    </button>

    <Transition name="ts-menu">
      <div v-if="isOpen" class="ts-menu">
        <div class="ts-header">{{ t('welcome.themeTitle') }}</div>
        <button
          v-for="theme in themes"
          :key="theme.id"
          :class="['ts-opt', { active: current === theme.id }]"
          :style="{ '--tc': theme.color }"
          @click="pick(theme.id)"
        >
          <span class="ts-dot" :style="{ background: theme.color }"></span>
          <span class="ts-name">{{ name(theme) }}</span>
          <Check v-if="current === theme.id" :size="14" class="ts-check" />
        </button>
      </div>
    </Transition>

    <Transition name="ts-fade">
      <div v-if="isOpen" class="ts-backdrop" @click="isOpen = false"></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Palette, Check } from 'lucide-vue-next';
import { usePreferencesStore } from '@/stores/preferences';
import { useI18n } from '@/composables/useI18n';
import { themes } from '@/i18n/themes';
import type { ThemeMode } from '@/types/theme';

const store = usePreferencesStore();
const { t, locale } = useI18n();

const isOpen = ref(false);
const current = ref(store.theme);

function pick(id: ThemeMode) {
  store.setTheme(id);
  current.value = id;
  isOpen.value = false;
}

function name(t: typeof themes[0]) {
  const m: Record<string, string> = { ru: t.nameRu, en: t.nameEn, zh: t.nameZh };
  return m[locale.value] || t.nameEn;
}
</script>

<style scoped>
.ts { position: relative; }

.ts-toggle {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ts-toggle:hover {
  border-color: var(--border-hover);
  color: var(--text);
  background: var(--bg-elevated);
}

.ts-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 0.5rem;
  box-shadow: var(--shadow-lg);
  z-index: 200;
}

.ts-header {
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  padding: 0.5rem 0.75rem 0.75rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0.25rem;
}

.ts-opt {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  width: 100%;
  text-align: left;
}

.ts-opt:hover {
  background: var(--bg-card);
  color: var(--text);
}

.ts-opt.active {
  background: var(--primary-muted);
  color: var(--primary);
}

.ts-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ts-name { flex: 1; }

.ts-check { color: var(--tc, var(--primary)); flex-shrink: 0; }

.ts-backdrop {
  position: fixed;
  inset: 0;
  z-index: 199;
}

/* Transitions */
.ts-menu-enter-active, .ts-menu-leave-active {
  transition: all 0.2s ease;
}
.ts-menu-enter-from, .ts-menu-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.ts-fade-enter-active, .ts-fade-leave-active {
  transition: opacity 0.15s ease;
}
.ts-fade-enter-from, .ts-fade-leave-to {
  opacity: 0;
}

/* ===== THEME OVERRIDES ===== */
[data-theme="win95"] .ts-toggle,
[data-theme="win95"] .ts-menu {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
  color: #000;
  box-shadow: none;
}

[data-theme="win95"] .ts-opt {
  color: #000;
  border-radius: 0;
}

[data-theme="win95"] .ts-opt:hover {
  background: #000080;
  color: #FFF;
}

[data-theme="win95"] .ts-opt.active {
  background: #000080;
  color: #FFF;
}

[data-theme="macclassic"] .ts-toggle,
[data-theme="macclassic"] .ts-menu {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
  box-shadow: 2px 2px 0 #000;
}

[data-theme="macclassic"] .ts-opt {
  color: #000;
}

[data-theme="macclassic"] .ts-opt.active {
  background: #000;
  color: #FFF;
}

[data-theme="classic"] .ts-toggle,
[data-theme="classic"] .ts-menu {
  border-radius: var(--radius-md);
  border: 1px solid rgba(0,0,0,0.08);
  background: #FFFFFF;
  color: var(--text);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

[data-theme="classic"] .ts-opt {
  color: var(--text-muted);
  border-radius: var(--radius-sm);
}

[data-theme="classic"] .ts-opt:hover {
  background: rgba(79,70,229,0.06);
  color: var(--primary);
}

[data-theme="classic"] .ts-opt.active {
  background: rgba(79,70,229,0.1);
  color: var(--primary);
}

[data-theme="terminal"] .ts-toggle,
[data-theme="terminal"] .ts-menu {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.3);
  background: #24283B;
  color: #A9B1D6;
  font-family: var(--font-mono);
}

[data-theme="terminal"] .ts-opt {
  color: #787C99;
  border-radius: 0;
  font-family: var(--font-mono);
}

[data-theme="terminal"] .ts-opt:hover {
  background: rgba(57,197,187,0.1);
  color: #39C5BB;
}

[data-theme="terminal"] .ts-opt.active {
  background: rgba(57,197,187,0.15);
  color: #39C5BB;
}

[data-theme="terminal"] .ts-dot {
  border-radius: 0;
}
</style>