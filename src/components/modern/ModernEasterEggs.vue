<template>
  <!-- No DOM: pure behaviour. Overlays are CSS on html.grid-debug -->
  <span aria-hidden="true" style="display:none"></span>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';

/**
 * Modern-only easter egg: the "designer's x-ray".
 * Press G three times within 900ms to toggle the Swiss grid overlay.
 * The visual overlay itself lives in src/styles/modern/grid-debug.css.
 */
const store = usePreferencesStore();

let taps: number[] = [];

function onKey(e: KeyboardEvent) {
  if (store.theme !== 'modern') return;
  // ignore when typing in a field
  const el = e.target as HTMLElement | null;
  if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
  if (e.key !== 'g' && e.key !== 'G') return;

  const now = Date.now();
  taps = taps.filter((t) => now - t < 900);
  taps.push(now);
  if (taps.length >= 3) {
    taps = [];
    const on = document.documentElement.classList.toggle('grid-debug');
    if (on) store.findEasterEgg('grid-debug');
  }
}

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
  document.documentElement.classList.remove('grid-debug');
});
</script>
