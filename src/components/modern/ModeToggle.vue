<template>
  <button
    class="mode-toggle"
    :title="`Appearance: ${label} — click to change`"
    :aria-label="`Appearance: ${label}`"
    @click="store.cycleColorMode()"
  >
    <Monitor v-if="mode === 'auto'" :size="16" />
    <Sun v-else-if="mode === 'light'" :size="16" />
    <Moon v-else :size="16" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Sun, Moon, Monitor } from 'lucide-vue-next';
import { usePreferencesStore } from '@/stores/preferences';

const store = usePreferencesStore();
const mode = computed(() => store.colorMode);
const label = computed(() =>
  mode.value === 'auto' ? 'Auto (system)' : mode.value === 'light' ? 'Light' : 'Dark'
);
</script>

<style scoped>
.mode-toggle {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.mode-toggle:hover {
  color: var(--text);
  border-color: var(--border-hover);
}

/* match Modern's square, hairline nav controls */
:global(html[data-theme="modern"]) .mode-toggle {
  border-radius: 0;
  border: 1px solid var(--rule);
  background: transparent;
  color: var(--text);
}
</style>
