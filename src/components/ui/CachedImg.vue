<template>
  <img :src="resolved" :alt="alt || ''" loading="lazy" decoding="async" />
</template>

<script setup lang="ts">
import { useCachedImg } from '@/composables/useCachedImg';

const props = defineProps<{ src?: string; alt?: string }>();
const { src: resolved } = useCachedImg(props.src);
</script>
