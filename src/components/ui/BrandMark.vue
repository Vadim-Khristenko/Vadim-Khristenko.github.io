<template>
  <span class="brandmark" :style="{ '--bm-size': (size ?? 28) + 'px' }" aria-hidden="true">
    <img src="/favicon/web-app-manifest-192x192.png" alt="" class="bm-fav" />
    <svg class="bm-hex" viewBox="0 0 40 40" fill="none">
      <path d="M20 2L4 10v20l16 8 16-8V10L20 2z" stroke="currentColor" stroke-width="2.4" />
    </svg>
  </span>
</template>

<script setup lang="ts">
// The site's brand mark: the favicon tucked inside the VAI hexagon, tilted a
// touch. The hexagon outline uses currentColor so it still adapts to each theme;
// the favicon sits in the middle where the old accent shape used to be.
defineProps<{ size?: number }>();
</script>

<style scoped>
.brandmark {
  position: relative;
  display: inline-flex;
  flex: none;
  width: var(--bm-size, 28px);
  height: var(--bm-size, 28px);
  transform: rotate(-9deg);
  vertical-align: middle;
}
.bm-hex {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.bm-fav {
  position: absolute;
  inset: 16%;
  width: 68%;
  height: 68%;
  object-fit: cover;
  /* pointy-top hexagon, matching the outline */
  clip-path: polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 74%, 5% 26%);
}
</style>
