<template>
  <section id="projects" class="projects">
    <div class="proj-inner">
      <header class="sec-header">
        <h2>{{ t('projects.title') }}</h2>
        <p>{{ t('projects.subtitle') }}</p>
      </header>

      <!-- GitHub summary — pinned projects only -->
      <div class="gh-trophy">
        <div class="trophy-item">
          <Star :size="15" />
          <span>{{ fmt(pinnedStars) }} {{ tc('hero.stats.stars', pinnedStars) }}</span>
        </div>
        <div class="trophy-item">
          <GitFork :size="15" />
          <span>{{ fmt(pinnedForks) }} {{ tc('hero.stats.forks', pinnedForks) }}</span>
        </div>
        <div class="trophy-item">
          <FolderGit2 :size="15" />
          <span>{{ pinnedWithRepo }} {{ t('projects.onGithub') }}</span>
        </div>
      </div>
      <p class="gh-trophy-note">* {{ t('projects.pinnedNote') }}</p>

      <!-- Project index -->
      <div class="proj-grid">
        <article
          v-for="(p, i) in projects"
          :key="p.name"
          class="proj-card"
          :class="{ featured: p.featured }"
          :style="{ '--card-accent': p.accent || 'var(--primary)' }"
        >
          <div class="proj-top">
            <span class="proj-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="proj-status" :class="`st-${p.status}`">
              {{ statusDot(p.status) }} {{ t(`status.${p.status}`) }}
            </span>
            <div class="proj-links">
              <a v-if="p.url" :href="p.url" target="_blank" rel="noopener" class="proj-link" title="Open">
                <ExternalLink :size="15" />
              </a>
              <a v-if="p.github" :href="p.github" target="_blank" rel="noopener" class="proj-link" title="GitHub">
                <Github :size="15" />
              </a>
            </div>
          </div>

          <h3 class="proj-name">{{ p.name }}</h3>
          <p class="proj-desc">{{ descOf(p) }}</p>

          <div class="proj-foot">
            <div v-if="starsOf(p) || forksOf(p) || issuesOf(p) || releaseOf(p) || p.language" class="proj-gh">
              <span v-if="starsOf(p)"><Star :size="12" /> {{ fmt(starsOf(p)) }}</span>
              <span v-if="forksOf(p)"><GitFork :size="12" /> {{ fmt(forksOf(p)) }}</span>
              <span v-if="issuesOf(p)" title="Open issues + PRs"><CircleDot :size="12" /> {{ fmt(issuesOf(p)) }}</span>
              <span v-if="releaseOf(p)" class="proj-rel" title="Latest release"><Tag :size="12" /> {{ releaseOf(p) }}</span>
              <span v-if="p.language" class="proj-lang">
                <i class="lang-dot" :style="{ background: p.accent || 'var(--primary)' }"></i>{{ p.language }}
              </span>
            </div>
            <div v-if="p.stack" class="proj-stack">
              <span v-for="s in p.stack" :key="s" class="stack-tag">{{ s }}</span>
            </div>
          </div>
        </article>
      </div>

      <!-- Why -->
      <div class="proj-why">
        <h4>{{ t('projects.why') }}</h4>
        <p>{{ t('projects.why.desc') }}</p>
        <a href="https://github.com/Vadim-Khristenko?tab=repositories" target="_blank" rel="noopener" class="gh-link">
          <Github :size="16" />
          {{ t('projects.viewGithub') }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Github, Star, GitFork, ExternalLink, CircleDot, Tag, FolderGit2 } from 'lucide-vue-next';
import { useI18n } from '@/composables/useI18n';
import { useStats } from '@/composables/useStats';
import { projects } from '@/data/projects';
import type { Project } from '@/data/types';

const { t, tl, tc } = useI18n();

const { stats } = useStats();
// Projects banner intentionally sums ONLY the pinned projects shown below —
// not the global GitHub total (that lives in the Hero).
const pinnedStars = computed(() => projects.reduce((a, p) => a + (starsOf(p) || 0), 0));
const pinnedForks = computed(() => projects.reduce((a, p) => a + (forksOf(p) || 0), 0));
const pinnedWithRepo = computed(() => projects.filter((p) => !!p.github).length);

function repoKeyOf(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/github\.com\/[^/]+\/([^/#?]+)/i);
  return m ? m[1].toLowerCase().replace(/\.git$/, '') : null;
}
function starsOf(p: Project): number | undefined {
  const k = repoKeyOf(p.github);
  return (k ? stats.value?.repos?.[k]?.stars : undefined) ?? p.stars;
}
function forksOf(p: Project): number | undefined {
  const k = repoKeyOf(p.github);
  return (k ? stats.value?.repos?.[k]?.forks : undefined) ?? p.forks;
}
function issuesOf(p: Project): number | undefined {
  const k = repoKeyOf(p.github);
  return k ? stats.value?.repos?.[k]?.issues : undefined;
}
function releaseOf(p: Project): string | undefined {
  const k = repoKeyOf(p.github);
  return k ? stats.value?.repos?.[k]?.release : undefined;
}

function descOf(p: Project): string {
  return p.descKey ? t(p.descKey as any) : tl(p.desc);
}

function statusDot(s: string): string {
  const m: Record<string, string> = { live: '🟢', indev: '🟡', comingsoon: '🟠', ideation: '💡', alpha: '🔵' };
  return m[s] || '⚪';
}

function fmt(n?: number): string {
  if (!n) return '0';
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

</script>

<style scoped>
.projects { padding: var(--space-24) 1.5rem; }
.proj-inner { max-width: 1200px; margin: 0 auto; }

.sec-header { margin-bottom: var(--space-8); }
.sec-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.sec-header p { color: var(--text-muted); font-size: var(--font-size-lg); }

/* Trophy banner */
.gh-trophy {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.trophy-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.gh-trophy-note {
  margin: calc(-1 * var(--space-2)) 0 var(--space-8);
  font-size: var(--font-size-xs);
  color: var(--text-dim);
  opacity: 0.85;
}

/* Project grid */
.proj-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}
.proj-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: transform var(--transition-base), border-color var(--transition-fast), box-shadow var(--transition-base);
}
.proj-card:hover {
  transform: translateY(-4px);
  border-color: var(--card-accent, var(--border-hover));
  box-shadow: var(--shadow-md);
}
.proj-card.featured {
  grid-column: span 2;
  border-left-width: 4px;
  background:
    linear-gradient(115deg, color-mix(in srgb, var(--card-accent) 6%, transparent), transparent 55%),
    var(--bg-card);
}

.proj-top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.proj-index {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--card-accent, var(--text-dim));
  font-weight: 600;
}
.proj-status {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
}
.proj-links { margin-left: auto; display: flex; gap: 0.25rem; }
.proj-link {
  display: inline-flex;
  padding: 0.35rem;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), border-color var(--transition-fast);
}
.proj-link:hover { color: var(--card-accent, var(--primary)); border-color: var(--card-accent, var(--border-hover)); }

.proj-name {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: 0.4rem;
}
.proj-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: var(--space-4);
  flex: 1;
}

.proj-foot { display: flex; flex-direction: column; gap: var(--space-3); }
.proj-gh {
  display: flex;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-dim);
}
.proj-gh span { display: inline-flex; align-items: center; gap: 0.3rem; }
.lang-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

.proj-stack { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.stack-tag {
  padding: 0.25rem 0.6rem;
  background: color-mix(in srgb, var(--card-accent) 8%, transparent);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* Why block */
.proj-why {
  margin-top: var(--space-8);
  padding: var(--space-6);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-align: center;
}
.proj-why h4 {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.proj-why p { color: var(--text-muted); font-size: var(--font-size-sm); margin-bottom: var(--space-4); max-width: 56ch; margin-inline: auto; }
.gh-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  background: var(--primary);
  color: #fff;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}
.gh-link:hover { transform: translateY(-2px); }

@media (max-width: 820px) {
  .proj-card.featured { grid-column: span 1; }
}
@media (max-width: 640px) {
  .projects { padding: var(--space-16) 1rem; }
  .proj-grid { grid-template-columns: 1fr; }
}

/* ============================================================
   THEME OVERRIDES (Modern handled in modern.css)
   ============================================================ */
[data-theme="win95"] .proj-card,
[data-theme="win95"] .proj-why,
[data-theme="win95"] .trophy-card {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
  color: #000;
}
[data-theme="win95"] .proj-desc { color: #404040; }
[data-theme="win95"] .stack-tag { border-radius: 0; background: #FFF; color: #000; border: 1px solid #808080; }

[data-theme="macclassic"] .proj-card,
[data-theme="macclassic"] .proj-why,
[data-theme="macclassic"] .trophy-card {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
  box-shadow: 2px 2px 0 #000;
}

[data-theme="classic"] .proj-card,
[data-theme="classic"] .proj-why,
[data-theme="classic"] .trophy-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-left: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

[data-theme="terminal"] .proj-card,
[data-theme="terminal"] .proj-why,
[data-theme="terminal"] .trophy-card {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.15);
  border-left: 2px solid var(--card-accent, #39C5BB);
  background: #24283B;
  font-family: var(--font-mono);
}
[data-theme="terminal"] .proj-desc { color: #787C99; }
[data-theme="terminal"] .proj-name { color: #A9B1D6; }
</style>
