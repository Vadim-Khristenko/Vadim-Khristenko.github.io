<template>
  <footer class="blog-footer">
    <div class="blog-footer-inner">
      <a href="/" class="blog-footer-home"><span class="chev">←</span> {{ t('blog.backHome') }}</a>
      <span class="blog-footer-spacer"></span>
      <div class="blog-footer-links">
        <a href="/">{{ t('blog.home') }}</a>
        <a href="/blog/">{{ t('nav.blog') }}</a>
        <a href="https://github.com/Vadim-Khristenko" target="_blank" rel="noopener">GitHub</a>
        <a href="/#contact">{{ t('nav.contact') }}</a>
        <a
          href="/editor"
          class="blog-footer-studio"
          :title="t('blog.studioNote')"
        >✎ {{ t('blog.studio') }}</a>
      </div>
      <span class="blog-footer-copy">© 2026 VAI_PROG · {{ t('blog.footerNote') }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
</script>

<style scoped>
.blog-footer-studio { color: var(--primary); opacity: 0.85; }
.blog-footer-studio:hover { opacity: 1; text-decoration: underline; }
</style>
