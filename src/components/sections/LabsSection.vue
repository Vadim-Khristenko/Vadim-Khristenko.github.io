<template>
  <section id="labs" class="labs">
    <div class="labs-inner">
      <header class="sec-header">
        <h2>{{ t('labs.title') }}</h2>
        <p>{{ t('labs.subtitle') }}</p>
      </header>

      <div class="labs-grid">
        <a
          v-for="lab in labs"
          :key="lab.name"
          :href="lab.url"
          target="_blank"
          rel="noopener"
          class="lab-card"
          :style="{ '--card-accent': lab.accent || 'var(--primary)' }"
        >
          <div class="lab-top">
            <span class="lab-ico">
              <CachedImg v-if="lab.image" :src="lab.image" :alt="lab.name" />
              <component v-else :is="lab.icon" :size="22" />
            </span>
            <span class="lab-kind" :class="`k-${lab.kind || 'fun'}`">
              {{ t(`labs.kind.${lab.kind || 'fun'}`) }}
            </span>
            <ArrowUpRight class="lab-arrow" :size="18" />
          </div>

          <h3 class="lab-name">{{ lab.name }}</h3>
          <p v-if="lab.tagline" class="lab-tag">{{ tl(lab.tagline) }}</p>
          <p class="lab-desc">{{ tl(lab.desc) }}</p>

          <div class="lab-foot">
            <div v-if="lab.stack" class="lab-stack">
              <span v-for="s in lab.stack" :key="s" class="stack-tag">{{ s }}</span>
            </div>
            <span class="lab-open">{{ t('labs.open') }}</span>
          </div>
        </a>
      </div>

      <p class="labs-note">{{ t('labs.note') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import { useI18n } from '@/composables/useI18n';
import { labs } from '@/data/labs';
import CachedImg from '../ui/CachedImg.vue';

const { t, tl } = useI18n();
</script>

<style scoped>
.labs { padding: var(--space-24) 1.5rem; }
.labs-inner { max-width: 1200px; margin: 0 auto; }

.sec-header { margin-bottom: var(--space-8); }
.sec-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.sec-header p { color: var(--text-muted); font-size: var(--font-size-lg); }

.labs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.lab-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background:
    radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--card-accent) 10%, transparent), transparent 60%),
    var(--bg-card);
  border: 1px solid var(--border);
  border-top: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: transform var(--transition-base), border-color var(--transition-fast), box-shadow var(--transition-base);
}
.lab-card:hover {
  transform: translateY(-4px);
  border-color: var(--card-accent, var(--border-hover));
  box-shadow: var(--shadow-md);
}

.lab-top { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); }
.lab-ico {
  display: inline-grid;
  place-items: center;
  width: 44px; height: 44px;
  border-radius: var(--radius-md);
  overflow: hidden;
  color: var(--card-accent, var(--primary));
  background: color-mix(in srgb, var(--card-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--card-accent) 30%, transparent);
}
.lab-ico img { width: 100%; height: 100%; object-fit: cover; display: block; }
.lab-kind {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  color: var(--text-dim);
}
.lab-kind.k-utility { color: var(--card-accent, var(--primary)); border-color: color-mix(in srgb, var(--card-accent) 35%, transparent); }
.lab-arrow { margin-left: auto; color: var(--text-dim); transition: transform var(--transition-fast), color var(--transition-fast); }
.lab-card:hover .lab-arrow { transform: translate(2px, -2px); color: var(--card-accent, var(--primary)); }

.lab-name { font-family: var(--font-display); font-size: var(--font-size-xl); font-weight: 700; margin-bottom: 0.25rem; }
.lab-tag { font-size: var(--font-size-sm); color: var(--card-accent, var(--primary)); font-weight: 600; margin-bottom: 0.6rem; }
.lab-desc { font-size: var(--font-size-sm); color: var(--text-muted); line-height: 1.55; margin-bottom: var(--space-4); flex: 1; }

.lab-foot { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap; }
.lab-stack { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.stack-tag {
  padding: 0.25rem 0.6rem;
  background: color-mix(in srgb, var(--card-accent) 8%, transparent);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  font-family: var(--font-mono);
}
.lab-open {
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--card-accent, var(--primary));
}

.labs-note { margin-top: var(--space-6); text-align: center; color: var(--text-dim); font-size: var(--font-size-sm); }

@media (max-width: 640px) {
  .labs { padding: var(--space-16) 1rem; }
  .labs-grid { grid-template-columns: 1fr; }
}

/* ============================================================
   THEME OVERRIDES
   ============================================================ */
/* win95 — var-based so it adapts to the High-Contrast (dark) mode */
[data-theme="win95"] .lab-card {
  border-radius: 0;
  border: 2px solid;
  border-color: var(--bevel-out);
  background: var(--field);
  color: var(--field-text);
}
[data-theme="win95"] .lab-name,
[data-theme="win95"] .lab-desc,
[data-theme="win95"] .lab-open { color: var(--field-text); }
[data-theme="win95"] .lab-ico {
  border-radius: 0;
  background: var(--win-face);
  border: 1px solid; border-color: var(--bevel-in);
  color: var(--field-text);
}
[data-theme="win95"] .lab-kind,
[data-theme="win95"] .lab-kind.k-utility {
  border-radius: 0;
  background: var(--win-face);
  color: var(--field-text);
  border: 2px solid;
  border-color: var(--bevel-out);
  letter-spacing: 0;
}
[data-theme="win95"] .stack-tag {
  border-radius: 0;
  background: var(--win-face);
  color: var(--field-text);
  border: 1px solid; border-color: var(--bevel-in);
}

/* mac classic — var-based so it flips with the inverted dark mode */
[data-theme="macclassic"] .lab-card {
  border-radius: 0;
  border: 1px solid var(--ink);
  background: var(--paper);
  color: var(--ink);
  box-shadow: 2px 2px 0 var(--ink);
}
[data-theme="macclassic"] .lab-name,
[data-theme="macclassic"] .lab-desc { color: var(--ink); }
[data-theme="macclassic"] .lab-ico { border-radius: 0; background: var(--paper); color: var(--ink); border: 1px solid var(--ink); }
[data-theme="macclassic"] .lab-kind,
[data-theme="macclassic"] .lab-kind.k-utility {
  border-radius: 0;
  background: var(--paper);
  color: var(--ink);
  border: 1px solid var(--ink);
}
[data-theme="macclassic"] .stack-tag {
  border-radius: 0;
  background: var(--paper);
  color: var(--ink);
  border: 1px solid var(--ink);
}

[data-theme="classic"] .lab-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-top: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

[data-theme="terminal"] .lab-card {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.15);
  border-top: 2px solid var(--card-accent, #39C5BB);
  background: #24283B;
  font-family: var(--font-mono);
}
[data-theme="terminal"] .lab-desc { color: #787C99; }
[data-theme="terminal"] .lab-name { color: #A9B1D6; }
</style>
