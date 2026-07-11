<template>
  <div class="blog-controls">
    <!-- language -->
    <div class="lang">
      <button class="lang-btn" @click="langOpen = !langOpen">{{ locale.toUpperCase() }}</button>
      <Transition name="lang-drop">
        <div v-if="langOpen" class="lang-menu">
          <button
            v-for="l in availableLocales"
            :key="l.code"
            :class="['lang-opt', { active: locale === l.code }]"
            @click="setLocale(l.code); langOpen = false"
          >{{ l.flag }} {{ l.name }}</button>
        </div>
      </Transition>
    </div>

    <ModeToggle v-if="hasMode" />
    <ThemeSwitcher />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '@/composables/useI18n';
import { usePreferencesStore } from '@/stores/preferences';
import ThemeSwitcher from '../theme/ThemeSwitcher.vue';
import ModeToggle from '../modern/ModeToggle.vue';

const { locale, availableLocales, setLocale } = useI18n();
const store = usePreferencesStore();
const langOpen = ref(false);
const hasMode = computed(() => ['modern', 'win95', 'macclassic', 'classic'].includes(store.theme));
</script>

<style scoped>
.blog-controls { display: flex; align-items: center; gap: 0.5rem; }
.lang { position: relative; }
.lang-btn {
  height: 36px; padding: 0 0.6rem;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  font-weight: 600;
  cursor: pointer;
}
.lang-btn:hover { border-color: var(--border-hover); color: var(--text); }
.lang-menu {
  position: absolute; top: calc(100% + 6px); right: 0;
  background: var(--bg-elevated); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 0.375rem; min-width: 150px;
  box-shadow: var(--shadow-lg); z-index: 200;
}
.lang-opt {
  display: flex; align-items: center; gap: 0.5rem; width: 100%; text-align: left;
  padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);
  border: none; background: transparent; color: var(--text-muted);
  font-size: var(--font-size-sm); cursor: pointer;
}
.lang-opt:hover { background: var(--bg-card); color: var(--text); }
.lang-opt.active { color: var(--primary); background: var(--primary-muted); }
.lang-drop-enter-active, .lang-drop-leave-active { transition: all 0.2s ease; }
.lang-drop-enter-from, .lang-drop-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
