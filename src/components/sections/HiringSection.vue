<template>
  <section id="hiring" class="hiring">
    <div class="hiring-inner">
      <!-- editorial header row -->
      <div class="hiring-head">
        <span class="hiring-index">03 / OPEN&nbsp;TO&nbsp;WORK</span>
        <span class="hiring-status">
          <i class="status-dot"></i>{{ t('hiring.badge') }}
        </span>
      </div>

      <div class="hiring-grid">
        <!-- left: the pitch -->
        <div class="hiring-main">
          <h2 class="hiring-title">{{ t('hiring.title') }}</h2>
          <p class="hiring-lead">{{ t('hiring.desc') }}</p>
          <p class="hiring-detail">{{ t('hiring.detail') }}</p>

          <div class="discount-block">
            <Tag :size="15" />
            <span>{{ t('hiring.discount') }}</span>
          </div>
          <p class="hiring-intern">{{ t('hiring.intern') }}</p>

          <div class="hiring-acts">
            <a :href="`mailto:${t('hiring.email')}`" class="hbtn hbtn-primary">
              <Mail :size="16" />
              {{ t('hiring.cta') }}
            </a>
            <a :href="`mailto:${t('hiring.email')}`" class="hiring-email">
              {{ t('hiring.email') }}
            </a>
          </div>
        </div>

        <!-- right: numbered service list -->
        <ul class="hiring-services">
          <li v-for="(svc, i) in services" :key="svc.key" class="svc-item">
            <span class="svc-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="svc-icon" :style="{ '--svc': svc.color }">
              <component :is="svc.icon" :size="18" />
            </span>
            <span class="svc-label">{{ t(svc.key) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Code2, Bot, Globe, Server, Palette, Mail, Wrench, Tag } from 'lucide-vue-next';
import { useI18n } from '@/composables/useI18n';

const { t } = useI18n();

const services = [
  { key: 'hiring.svc.bots', color: '#3B82F6', icon: Bot },
  { key: 'hiring.svc.backend', color: '#10B981', icon: Server },
  { key: 'hiring.svc.devops', color: '#EF4444', icon: Wrench },
  { key: 'hiring.svc.web', color: '#A855F7', icon: Globe },
  { key: 'hiring.svc.frontend', color: '#06B6D4', icon: Code2 },
  { key: 'hiring.svc.ai', color: '#EC4899', icon: Palette },
];
</script>

<style scoped>
.hiring {
  padding: var(--space-24) 1.5rem;
}

.hiring-inner {
  max-width: 1100px;
  margin: 0 auto;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
}

/* header row */
.hiring-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-8);
  border-bottom: 1px solid var(--border);
}

.hiring-index {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.hiring-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 0 var(--success);
  animation: statusPulse 2.4s ease-out infinite;
}

@keyframes statusPulse {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--success) 55%, transparent); }
  70%, 100% { box-shadow: 0 0 0 7px transparent; }
}

/* main grid */
.hiring-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: var(--space-12);
  align-items: start;
}

.hiring-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--space-4);
}

.hiring-lead {
  font-size: var(--font-size-lg);
  color: var(--text);
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: var(--space-3);
}

.hiring-detail {
  font-size: var(--font-size-base);
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: var(--space-6);
  max-width: 46ch;
}

.discount-block {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: var(--space-3) var(--space-4);
  background: var(--accent-muted, rgba(245,158,11,0.06));
  border-left: 3px solid var(--accent-warm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text);
  line-height: 1.5;
  margin-bottom: var(--space-3);
}

.discount-block :deep(svg) { flex-shrink: 0; margin-top: 2px; color: var(--accent-warm); }

.hiring-intern {
  font-size: var(--font-size-sm);
  color: var(--text-dim);
  font-style: italic;
  margin-bottom: var(--space-8);
}

.hiring-acts {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.hbtn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.hbtn-primary {
  background: var(--primary);
  color: #fff;
  border: 1px solid var(--primary);
  box-shadow: var(--shadow-sm);
}

.hbtn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.hiring-email {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.hiring-email:hover { color: var(--primary); border-color: var(--primary); }

/* services list */
.hiring-services {
  list-style: none;
  border-top: 1px solid var(--border);
}

.svc-item {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 0.9rem;
  padding: var(--space-3) var(--space-1);
  border-bottom: 1px solid var(--border);
  transition: background var(--transition-fast), padding-left var(--transition-fast);
}

.svc-item:hover {
  background: var(--primary-muted);
  padding-left: var(--space-3);
}

.svc-num {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-dim);
}

.svc-icon {
  display: inline-flex;
  color: var(--svc, var(--primary));
}

.svc-label {
  font-size: var(--font-size-sm);
  color: var(--text);
  font-weight: 500;
}

/* ── responsive ── */
@media (max-width: 820px) {
  .hiring { padding: var(--space-16) 1rem; }
  .hiring-inner { padding: var(--space-6); }
  .hiring-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  .hiring-services {
    margin-top: var(--space-2);
    border-top: 1px solid var(--border);
  }
}

@media (max-width: 480px) {
  .hiring-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .hiring-acts { gap: var(--space-3); }
  .hbtn-primary { width: 100%; justify-content: center; }
  .hiring-detail { max-width: none; }
}

/* ============================================================
   THEME OVERRIDES (non-Modern; Modern handled in modern.css)
   ============================================================ */
[data-theme="win95"] .hiring-inner {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
  color: #000;
}
[data-theme="win95"] .svc-item { border-bottom: 1px solid #808080; }
[data-theme="win95"] .discount-block {
  background: #FFFFCC;
  border-left: 3px solid #808000;
  color: #000;
}

[data-theme="macclassic"] .hiring-inner {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
  box-shadow: 3px 3px 0 #000;
}
[data-theme="macclassic"] .discount-block {
  border-left: 3px solid #000;
  background: #FFF;
  color: #000;
}

[data-theme="terminal"] .hiring-inner {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.25);
  background: #24283B;
}
[data-theme="terminal"] .hiring-title::before {
  content: '$ ./hire-me.sh';
  display: block;
  color: #787C99;
  font-size: 0.5em;
  margin-bottom: 0.6rem;
}
[data-theme="terminal"] .svc-icon,
[data-theme="terminal"] .discount-block :deep(svg) { color: #39C5BB; }
</style>
