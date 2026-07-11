<template>
  <div class="lic-root">
    <nav class="blog-nav">
      <a href="/" class="blog-nav-home"><BrandMark :size="20" /> VAI_PROG</a>
      <span class="blog-nav-tag">{{ t('nav.license') }}</span>
      <span class="blog-nav-spacer"></span>
      <BlogControls />
    </nav>
    <LicenseSection />
  </div>
</template>

<script setup lang="ts">
import { createPinia, setActivePinia } from 'pinia';
setActivePinia(createPinia());
import { useI18n } from '@/composables/useI18n';
import BlogControls from './blog/BlogControls.vue';
import LicenseSection from './sections/LicenseSection.vue';
import BrandMark from './ui/BrandMark.vue';

const { t } = useI18n();
</script>

<style scoped>
.lic-root {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}
</style>
