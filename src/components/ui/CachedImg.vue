<template>
  <img :src="resolved" :alt="alt || ''" loading="lazy" decoding="async" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { resolveCachedImg, memoedBlob, isCached } from '@/composables/useCachedImg';

const props = defineProps<{ src?: string; alt?: string }>();

// Reactive to props.src so a reused instance (search/filter) never sticks on the
// previous image. Priority: session blob (instant) → known-cached (wait ~ms for
// the blob, zero network) → unknown (show the real URL now, upgrade to blob later).
const resolved = ref<string | undefined>(props.src);
let token = 0;

watch(
  () => props.src,
  (url) => {
    const my = ++token;

    const memoed = memoedBlob(url);
    if (memoed) {
      resolved.value = memoed;
      return;
    }

    // known-cached → hold for the blob (avoids a needless network hit); otherwise
    // show the real URL straight away so the image is always correct.
    resolved.value = isCached(url) ? undefined : url;

    // safety net: never stay blank if the cache lookup stalls.
    if (resolved.value === undefined) {
      setTimeout(() => {
        if (my === token && resolved.value === undefined) resolved.value = url;
      }, 120);
    }

    resolveCachedImg(url).then((blob) => {
      if (my === token) resolved.value = blob ?? url;
    });
  },
  { immediate: true }
);
</script>
