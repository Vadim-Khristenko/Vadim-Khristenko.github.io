<template>
  <div v-if="showWelcome" class="welcome-overlay">
    <WelcomeScreen @done="showWelcome = false" />
  </div>
  <MainPage />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import MainPage from './MainPage.vue';
import WelcomeScreen from './welcome/WelcomeScreen.vue';
import { usePreferencesStore } from '@/stores/preferences';

// Initialize Pinia before any component uses usePreferencesStore()
// This is required for client:only islands where app.use() is not called
setActivePinia(createPinia());

const store = usePreferencesStore();
// The welcome screen shows exactly once — the first visit. After the visitor
// finishes (or skips), markVisited() persists the flag to localStorage so it
// never appears again.
const showWelcome = ref(store.isFirstVisit);
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
