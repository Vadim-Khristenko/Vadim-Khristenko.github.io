<template>
  <section id="achievements" class="achievements">
    <div class="ach-inner">
      <header class="sec-header">
        <h2>{{ t('achievements.title') }}</h2>
        <p>{{ t('achievements.subtitle') }}</p>
      </header>

      <div class="ach-grid">
        <article
          v-for="(a, i) in achievements"
          :key="i"
          class="ach-card"
          :class="{ featured: a.featured }"
          :style="{ '--card-accent': a.accent || 'var(--primary)' }"
        >
          <div class="ach-top">
            <span class="ach-ico">
              <img v-if="a.image" :src="a.image" :alt="tl(a.title)" loading="lazy" />
              <component v-else-if="a.icon" :is="a.icon" :size="22" />
            </span>
            <div class="ach-meta">
              <span v-if="a.tag" class="ach-tag">{{ tl(a.tag) }}</span>
              <span v-if="a.year" class="ach-year">{{ a.year }}</span>
            </div>
            <a v-if="a.url" :href="a.url" target="_blank" rel="noopener" class="ach-link" :title="tl(a.title)">
              <ExternalLink :size="15" />
            </a>
          </div>

          <h3 class="ach-title">{{ tl(a.title) }}</h3>
          <p v-if="a.desc" class="ach-desc">{{ tl(a.desc) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next';
import { useI18n } from '@/composables/useI18n';
import { achievements } from '@/data/achievements';

const { t, tl } = useI18n();
</script>

<style scoped>
.achievements { padding: var(--space-24) 1.5rem; }
.ach-inner { max-width: 1200px; margin: 0 auto; }

.sec-header { margin-bottom: var(--space-8); }
.sec-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.sec-header p { color: var(--text-muted); font-size: var(--font-size-lg); }

.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.ach-card {
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--card-accent) 9%, transparent), transparent 55%),
    var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: transform var(--transition-base), border-color var(--transition-fast), box-shadow var(--transition-base);
}
.ach-card:hover {
  transform: translateY(-4px);
  border-color: var(--card-accent, var(--border-hover));
  box-shadow: var(--shadow-md);
}
.ach-card.featured {
  grid-column: span 2;
  border-left-width: 4px;
  background:
    linear-gradient(115deg, color-mix(in srgb, var(--card-accent) 12%, transparent), transparent 55%),
    var(--bg-card);
}

.ach-top { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); }
.ach-ico {
  display: inline-grid;
  place-items: center;
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
  color: var(--card-accent, var(--primary));
  background: color-mix(in srgb, var(--card-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--card-accent) 30%, transparent);
}
.ach-ico img { width: 100%; height: 100%; object-fit: cover; display: block; }

.ach-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.ach-tag {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
  color: var(--card-accent, var(--primary));
  background: color-mix(in srgb, var(--card-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--card-accent) 30%, transparent);
}
.ach-year { font-family: var(--font-mono); font-size: var(--font-size-xs); color: var(--text-dim); }
.ach-link {
  margin-left: auto;
  display: inline-flex;
  padding: 0.35rem;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), border-color var(--transition-fast);
}
.ach-link:hover { color: var(--card-accent, var(--primary)); border-color: var(--card-accent, var(--border-hover)); }

.ach-title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 0.4rem;
}
.ach-desc { font-size: var(--font-size-sm); color: var(--text-muted); line-height: 1.55; }

@media (max-width: 820px) { .ach-card.featured { grid-column: span 1; } }
@media (max-width: 640px) {
  .achievements { padding: var(--space-16) 1rem; }
  .ach-grid { grid-template-columns: 1fr; }
}

/* ============================================================
   THEME OVERRIDES
   ============================================================ */
[data-theme="win95"] .ach-card {
  border-radius: 0;
  border: 2px solid;
  border-color: var(--bevel-out);
  background: var(--field);
  color: var(--field-text);
}
[data-theme="win95"] .ach-title, [data-theme="win95"] .ach-desc { color: var(--field-text); }
[data-theme="win95"] .ach-ico { border-radius: 0; background: var(--win-face); border-color: var(--bevel-in); }
[data-theme="win95"] .ach-tag {
  border-radius: 0; background: var(--win-face); color: var(--field-text);
  border: 1px solid; border-color: var(--bevel-in);
}

[data-theme="macclassic"] .ach-card {
  border-radius: 0;
  border: 1px solid var(--ink);
  background: var(--paper);
  color: var(--ink);
  box-shadow: 2px 2px 0 var(--ink);
}
[data-theme="macclassic"] .ach-title, [data-theme="macclassic"] .ach-desc { color: var(--ink); }
[data-theme="macclassic"] .ach-ico { border-radius: 0; background: var(--paper); color: var(--ink); border: 1px solid var(--ink); }
[data-theme="macclassic"] .ach-tag { border-radius: 0; background: var(--paper); color: var(--ink); border: 1px solid var(--ink); }

[data-theme="classic"] .ach-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-left: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

[data-theme="terminal"] .ach-card {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.15);
  border-left: 2px solid var(--card-accent, #39C5BB);
  background: #24283B;
  font-family: var(--font-mono);
}
[data-theme="terminal"] .ach-title { color: #A9B1D6; }
[data-theme="terminal"] .ach-desc { color: #787C99; }
</style>
