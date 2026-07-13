<template>
  <section id="communities" class="communities">
    <div class="communities-inner">
      <header class="sec-header">
        <h2>{{ t('communities.title') }}</h2>
        <p>{{ t('communities.subtitle') }}</p>
      </header>

      <!-- Search -->
      <div class="c-search">
        <Search :size="16" class="c-search-ico" />
        <input
          v-model="q"
          type="search"
          class="c-search-input"
          :placeholder="t('communities.search')"
          :aria-label="t('communities.search')"
        />
        <span v-if="q" class="c-search-count">{{ filtered.length }}</span>
      </div>

      <div v-if="filtered.length" class="communities-grid">
        <article
          v-for="c in filtered"
          :key="nameOf(c)"
          class="community-card"
          :class="c.kind"
          :style="{ '--card-accent': c.accent || 'var(--primary)' }"
        >
          <div
            v-if="c.banner"
            class="c-banner"
            :style="{ backgroundImage: `url(${c.banner})` }"
          ></div>

          <div class="c-body" :class="{ 'has-banner': c.banner }">
            <div class="community-top">
              <div class="community-icon" :style="iconStyle(c)">
                <CachedImg v-if="c.avatar" :src="c.avatar" :alt="nameOf(c)" />
                <component v-else-if="c.icon" :is="c.icon" :size="22" />
                <CachedImg v-else :src="PLACEHOLDER" :alt="nameOf(c)" />
              </div>
              <div class="community-meta">
                <h4>
                  {{ nameOf(c) }}
                  <span
                    v-if="c.badge"
                    class="community-badge"
                    :style="{ background: tint(c.accent), color: c.accent }"
                  >{{ c.badge }}</span>
                </h4>
                <div v-if="c.members || c.kind" class="c-facts">
                  <span v-if="c.members" class="c-fact"><Users :size="12" /> {{ c.members }}</span>
                  <span v-if="c.kind" class="c-fact c-kind">{{ kindLabel(c) }}</span>
                </div>
              </div>
            </div>

            <p class="community-desc">{{ descOf(c) }}</p>

            <div v-if="tagsOf(c).length" class="c-tags">
              <span v-for="(tag, ti) in tagsOf(c)" :key="ti" class="c-tag">{{ tag }}</span>
            </div>

            <SocialLinks
              v-if="c.socials?.length || c.website"
              :socials="c.socials"
              :website="c.website"
              :accent="c.accent"
            />
          </div>
        </article>
      </div>

      <p v-else class="c-empty">{{ t('communities.noResults') }}</p>

      <!-- Suggest a community -->
      <div class="suggest-hint">
        <p>{{ t('communities.suggestHint') }}</p>
        <a
          href="https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/issues/new?template=suggest-community.yml"
          target="_blank"
          rel="noopener"
          class="suggest-link"
        >
          <MessageSquarePlus :size="14" />
          {{ t('communities.suggestCta') }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MessageSquarePlus, Search, Users } from 'lucide-vue-next';
import { useI18n } from '@/composables/useI18n';
import { communities } from '@/data/communities';
import type { Community } from '@/data/types';
import SocialLinks from '../ui/SocialLinks.vue';
import CachedImg from '../ui/CachedImg.vue';
import { matchesQuery, localizedAll, haystack } from '@/lib/search';

const { t, tl, tAll } = useI18n();

const PLACEHOLDER = '/avatars/PHOTO_NOT_FOUND.png';
const q = ref('');

function nameOf(c: Community): string {
  return tl(c.name);
}
function descOf(c: Community): string {
  return c.descKey ? t(c.descKey as any) : tl(c.desc);
}
function kindLabel(c: Community): string {
  return c.kind ? t(`communities.kind.${c.kind}` as any) : '';
}
function tagsOf(c: Community): string[] {
  return (c.tags ?? []).map((tag) => tl(tag)).filter(Boolean);
}
function tint(hex?: string): string {
  return hex ? `${hex}1F` : 'var(--primary-muted)';
}
function iconStyle(c: Community) {
  return c.avatar ? {} : { background: tint(c.accent), color: c.accent };
}

function haystackOf(c: Community): string {
  return haystack(
    localizedAll(c.name),
    c.descKey ? tAll(c.descKey) : localizedAll(c.desc),
    c.badge ? localizedAll(c.badge) : undefined,
    (c.tags ?? []).flatMap((tag) => localizedAll(tag))
  );
}
const filtered = computed(() => communities.filter((c) => matchesQuery(haystackOf(c), q.value)));
</script>

<style scoped>
.communities { padding: var(--space-24) 1.5rem; }
.communities-inner { max-width: 1200px; margin: 0 auto; }

.sec-header { margin-bottom: var(--space-6); }
.sec-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.sec-header p { color: var(--text-muted); font-size: var(--font-size-lg); }

/* Search */
.c-search {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 420px;
  margin-bottom: var(--space-6);
}
.c-search-ico { position: absolute; left: 0.85rem; color: var(--text-dim); pointer-events: none; }
.c-search-input {
  width: 100%;
  padding: 0.65rem 2.4rem 0.65rem 2.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text);
  font-size: var(--font-size-sm);
  font-family: inherit;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.c-search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}
.c-search-count {
  position: absolute;
  right: 0.75rem;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-dim);
}

.communities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}

.community-card {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-xl);
  transition: transform var(--transition-base), border-color var(--transition-fast), box-shadow var(--transition-base);
}
.community-card:hover {
  transform: translateY(-4px);
  border-color: var(--card-accent, var(--border-hover));
  box-shadow: var(--shadow-md);
}

/* banner */
.c-banner {
  height: 84px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.c-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--bg-card) 92%, transparent));
}

.c-body { padding: var(--space-6); }
.c-body.has-banner { padding-top: 0; margin-top: -22px; position: relative; z-index: 1; }

.community-top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.community-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.c-body.has-banner .community-icon {
  border: 3px solid var(--bg-card);
  box-shadow: var(--shadow-sm);
  background: var(--bg-card);
}
.community-icon img { width: 100%; height: 100%; object-fit: cover; }
.community-meta { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
.community-meta h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.community-badge {
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
}
.c-facts { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.c-fact {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-dim);
}
.c-fact svg { color: var(--card-accent, var(--primary)); opacity: 0.8; }
.c-kind { text-transform: uppercase; letter-spacing: 0.08em; }

.community-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: var(--space-3);
}

.c-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: var(--space-3); }
.c-tag {
  padding: 0.2rem 0.55rem;
  background: color-mix(in srgb, var(--card-accent) 8%, transparent);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.c-empty {
  text-align: center;
  color: var(--text-dim);
  font-size: var(--font-size-sm);
  padding: var(--space-8) 0;
}

/* Suggest a community */
.suggest-hint {
  margin-top: var(--space-8);
  padding: var(--space-4);
  background: var(--bg-card);
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.suggest-hint p { font-size: var(--font-size-sm); color: var(--text-muted); }
.suggest-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: var(--primary-muted);
  color: var(--primary);
  text-decoration: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all var(--transition-fast);
}
.suggest-link:hover { background: var(--primary); color: #fff; }

@media (max-width: 640px) {
  .communities { padding: var(--space-16) 1rem; }
  .communities-grid { grid-template-columns: 1fr; }
}

/* ============================================================
   THEME OVERRIDES (Modern handled in modern.css)
   ============================================================ */
[data-theme="win95"] .community-card {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
  color: #000;
}
[data-theme="win95"] .community-desc { color: #404040; }
[data-theme="win95"] .c-search-input { border-radius: 0; background: #FFF; color: #000; border: 2px solid; border-color: #808080 #DFDFDF #DFDFDF #808080; }
[data-theme="win95"] .c-tag { border-radius: 0; background: #FFF; border: 1px solid #808080; color: #000; }
[data-theme="win95"] .suggest-hint {
  border-radius: 0;
  border: 2px dashed #808080;
  background: #C0C0C0;
}

[data-theme="macclassic"] .community-card {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
  box-shadow: 2px 2px 0 #000;
}
[data-theme="macclassic"] .community-icon { border: 1px solid #000; }
[data-theme="macclassic"] .c-search-input { border-radius: 0; border: 1px solid #000; background: #FFF; color: #000; }
[data-theme="macclassic"] .suggest-hint {
  border-radius: 0;
  border: 1px dashed #000;
  background: #FFF;
}

[data-theme="classic"] .community-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-left: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
[data-theme="classic"] .suggest-hint {
  background: #FFFFFF;
  border: 1px dashed rgba(0,0,0,0.1);
  border-radius: var(--radius-lg);
}

[data-theme="terminal"] .community-card {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.15);
  border-left: 2px solid var(--card-accent, #39C5BB);
  background: #24283B;
  font-family: var(--font-mono);
}
[data-theme="terminal"] .community-desc { color: #787C99; }
[data-theme="terminal"] .community-icon { border: 1px solid rgba(57,197,187,0.2); }
[data-theme="terminal"] .c-search-input { border-radius: 0; background: #1A1B26; border: 1px solid rgba(57,197,187,0.2); color: #A9B1D6; }
</style>
