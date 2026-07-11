<template>
  <footer class="blog-footer">
    <div class="blog-footer-inner">
      <a href="/" class="blog-footer-home"><BrandMark :size="20" /> {{ t('blog.backHome') }}</a>
      <span class="blog-footer-spacer"></span>
      <div class="blog-footer-links">
        <a href="/">{{ t('blog.home') }}</a>
        <a href="/blog/">{{ t('nav.blog') }}</a>
        <a href="https://github.com/Vadim-Khristenko" target="_blank" rel="noopener">GitHub</a>
        <a href="/#contact">{{ t('nav.contact') }}</a>
        <a href="/license">{{ t('nav.license') }}</a>
        <a
          href="/editor"
          class="blog-footer-studio"
          :title="t('blog.studioNote')"
        >✎ {{ t('blog.studio') }}</a>
      </div>
      <div class="blog-footer-legal">
        <span class="blog-footer-copy">© {{ year }} VAI_PROG · {{ t('blog.footerNote') }}</span>
        <span class="blog-footer-oss">{{ t('footer.oss') }} <a href="/license">{{ t('footer.licenseLink') }}</a>.</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@/composables/useI18n';
import BrandMark from '../ui/BrandMark.vue';
const { t } = useI18n();
const year = computed(() => new Date().getFullYear());
</script>

<style scoped>
.blog-footer-home { display: inline-flex; align-items: center; gap: 0.4rem; }
.blog-footer-studio { color: var(--primary); opacity: 0.85; }
.blog-footer-studio:hover { opacity: 1; text-decoration: underline; }
.blog-footer-legal { display: flex; flex-direction: column; gap: 0.2rem; }
.blog-footer-oss { font-size: var(--font-size-xs); color: var(--text-dim); opacity: 0.85; }
.blog-footer-oss a { color: var(--text-muted); text-decoration: none; border-bottom: 1px solid var(--border); }
.blog-footer-oss a:hover { color: var(--primary); border-color: var(--primary); }
</style>
