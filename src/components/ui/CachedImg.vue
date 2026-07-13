<template>
  <img :src="resolved" :alt="alt || ''" loading="lazy" decoding="async" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { resolveCachedImg } from '@/composables/useCachedImg';

const props = defineProps<{ src?: string; alt?: string }>();

// Start with the real URL and re-resolve whenever it changes — so when Vue reuses
// this instance for a different item (filtering/search) the image updates instantly
// instead of sticking on the previous one. A token guards against out-of-order
// async swaps if src changes again before the cache lookup resolves.
const resolved = ref<string | undefined>(props.src);
let token = 0;

watch(
  () => props.src,
  (url) => {
    const my = ++token;
    resolved.value = url; // correct image immediately, never sticky
    resolveCachedImg(url).then((blob) => {
      if (my === token && blob) resolved.value = blob; // upgrade to cached blob if we have it
    });
  },
  { immediate: true }
);
</script>
