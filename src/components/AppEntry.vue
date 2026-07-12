<template>
  <div v-if="showWelcome" class="welcome-overlay">
    <WelcomeScreen @done="showWelcome = false" />
  </div>
  <MainPage />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import MainPage from './MainPage.vue';
import WelcomeScreen from './welcome/WelcomeScreen.vue';
import { usePreferencesStore } from '@/stores/preferences';

// Initialize Pinia before any component uses usePreferencesStore()
// This is required for client:only islands where app.use() is not called.
// Note: ?lang / ?theme / ?reset are handled pre-paint by the inline script in
// BaseLayout (which also persists them), so the store already reflects them here.
setActivePinia(createPinia());

const store = usePreferencesStore();

const jumpTarget =
  typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('jump-to')
    : null;

// The welcome screen shows exactly once — the first visit. A deep link
// (?jump-to=...) skips it so the target section is actually visible.
const showWelcome = ref(store.isFirstVisit && !jumpTarget);

onMounted(() => {
  if (!jumpTarget) return;
  const id = jumpTarget.replace(/^#/, '');
  // wait for the islands to render the sections, then smooth-scroll
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
  );
});
</script>

<style scoped>
.welcome-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  overflow-y: auto;
  background: var(--bg);
}
</style>
