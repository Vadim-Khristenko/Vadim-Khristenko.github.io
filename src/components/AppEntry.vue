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
import { prefetch } from '@/composables/useCachedImg';
import { friends } from '@/data/friends';
import { inspirations } from '@/data/inspirations';
import { communities } from '@/data/communities';

// Initialize Pinia before any component uses usePreferencesStore()
// This is required for client:only islands where app.use() is not called.
// Note: ?lang / ?theme / ?mode / ?reset are handled pre-paint by the inline script
// in BaseLayout (which also persists them), and ?jump-to / #hash scrolling + scroll
// restoration are handled by BaseLayout's scroll script — so nothing to do here but
// decide whether the welcome screen shows.
setActivePinia(createPinia());

const store = usePreferencesStore();

const hasScrollTarget =
  typeof window !== 'undefined' &&
  (!!new URLSearchParams(window.location.search).get('jump-to') || !!window.location.hash);

// The welcome screen shows exactly once — the first visit. A deep link
// (?jump-to=... or #hash) skips it so the target section is actually visible.
const showWelcome = ref(store.isFirstVisit && !hasScrollTarget);

// Warm every avatar/banner into the image cache on idle, so filtering/searching
// to any card is instant and network-free — even cards not yet on screen.
onMounted(() => {
  const urls: Array<string | undefined> = [
    '/avatars/VAI_PROG.png',
    ...friends.flatMap((f) => [f.avatar, f.banner]),
    ...inspirations.flatMap((p) => [p.avatar, p.banner]),
    ...communities.flatMap((c) => [c.avatar, c.banner]),
  ];
  prefetch(urls);
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
