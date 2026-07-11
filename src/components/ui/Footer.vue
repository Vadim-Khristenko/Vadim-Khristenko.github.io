<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-left">
        <div class="footer-logo">
          <svg viewBox="0 0 40 40" fill="none">
            <path d="M20 2L4 10v20l16 8 16-8V10L20 2z" stroke="currentColor" stroke-width="2"/>
            <path d="M20 12l-8 4v8l8 4 8-4v-8l-8-4z" fill="currentColor" opacity="0.2"/>
          </svg>
        </div>
        <span class="footer-name">VAI-PROG</span>
      </div>

      <div class="footer-links">
        <a v-for="l in links" :key="l.href" :href="l.href">{{ t(l.key) }}</a>
        <a href="/license">{{ t('nav.license') }}</a>
      </div>

      <div class="footer-legal">
        <p class="footer-copy">© {{ year }} {{ t('footer.copy') }} — {{ t('footer.rights') }}</p>
        <p class="footer-oss">
          {{ t('footer.oss') }}
          <a href="/license">{{ t('footer.licenseLink') }}</a>.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@/composables/useI18n';

const { t } = useI18n();

const year = computed(() => new Date().getFullYear());

const links = [
  { key: 'nav.about', href: '#about' },
  { key: 'nav.skills', href: '#skills' },
  { key: 'nav.projects', href: '#projects' },
  { key: 'nav.friends', href: '#friends' },
  { key: 'nav.communities', href: '#communities' },
  { key: 'nav.contact', href: '#contact' },
];
</script>

<style scoped>
.footer {
  padding: var(--space-8) 1.5rem;
  border-top: 1px solid var(--border);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.footer-logo {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.footer-logo svg { width: 100%; height: 100%; }

.footer-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--font-size-sm);
}

.footer-links {
  display: flex;
  gap: var(--space-6);
}

.footer-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  position: relative;
}

.footer-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--primary);
  transition: width var(--transition-fast);
}

.footer-links a:hover {
  color: var(--text);
}

.footer-links a:hover::after {
  width: 100%;
}

.footer-legal {
  text-align: right;
}
.footer-copy {
  font-size: var(--font-size-xs);
  color: var(--text-dim);
}
.footer-oss {
  font-size: var(--font-size-xs);
  color: var(--text-dim);
  margin-top: 0.3rem;
}
.footer-oss a {
  color: var(--text-muted);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: color var(--transition-fast);
}
.footer-oss a:hover { color: var(--primary); border-color: var(--primary); }

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    text-align: center;
  }

  .footer-legal { text-align: center; }

  .footer-links {
    gap: var(--space-4);
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
