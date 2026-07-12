<template>
  <section id="inspirations" class="inspirations">
    <div class="insp-inner">
      <header class="sec-header">
        <h2>{{ t('inspirations.title') }}</h2>
        <p>{{ t('inspirations.subtitle') }}</p>
      </header>

      <!-- Search -->
      <div class="insp-search">
        <Search :size="16" class="insp-search-ico" />
        <input
          v-model="q"
          type="search"
          class="insp-search-input"
          :placeholder="t('inspirations.search')"
          :aria-label="t('inspirations.search')"
        />
        <span v-if="q" class="insp-search-count">{{ filtered.length }}</span>
      </div>

      <div v-if="filtered.length" class="insp-grid">
        <InspCard v-for="(p, i) in filtered" :key="i" :person="p" />
      </div>
      <p v-else class="insp-empty">{{ t('inspirations.noResults') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue';
import { Search } from 'lucide-vue-next';
import { useI18n } from '@/composables/useI18n';
import { inspirations } from '@/data/inspirations';
import type { Inspiration } from '@/data/types';
import SocialLinks from '../ui/SocialLinks.vue';
import CachedImg from '../ui/CachedImg.vue';

const { t, tl } = useI18n();

const PLACEHOLDER = '/avatars/PHOTO_NOT_FOUND.png';
const q = ref('');

function nameOf(p: Inspiration): string {
  return tl(p.name);
}
function tagsOf(p: Inspiration): string[] {
  return (p.tags ?? []).map((tag) => tl(tag)).filter(Boolean);
}
function matches(p: Inspiration): boolean {
  const needle = q.value.trim().toLowerCase();
  if (!needle) return true;
  const hay = [nameOf(p), tl(p.role), tl(p.desc), ...tagsOf(p)].join(' ').toLowerCase();
  return hay.includes(needle);
}

const filtered = computed(() => inspirations.filter(matches));

// Reuses the GLOBAL friend-card styles (defined unscoped in FriendsSection).
const InspCard = defineComponent({
  props: { person: { type: Object as () => Inspiration, required: true } },
  setup(props) {
    const p = props.person;
    const accent = p.accent || 'var(--primary)';
    const role = () => tl(p.role);
    const desc = () => tl(p.desc);

    return () => {
      const nm = nameOf(p);
      const tags = tagsOf(p);
      return h(
        'div',
        { class: ['friend-card', { 'has-banner': !!p.banner }], style: { '--card-accent': accent } },
        [
          p.banner
            ? h('div', { class: 'fr-banner', style: { backgroundImage: `url(${p.banner})` } })
            : null,
          h('div', { class: 'fr-body' }, [
            h('div', { class: 'friend-top' }, [
              h('div', { class: 'insp-ava', title: 'On the radar — someday' }, [
                h(
                  'div',
                  { class: 'friend-avatar', style: { background: `${accent}1F`, color: accent } },
                  [h(CachedImg, { src: p.avatar || PLACEHOLDER, alt: nm })]
                ),
                h('span', { class: 'insp-star', 'aria-hidden': 'true' }, '✦'),
              ]),
              h('div', { class: 'friend-meta' }, [
                h('h4', { class: 'insp-name' }, nm),
                role() ? h('span', { class: 'friend-role' }, role()) : null,
              ]),
            ]),
            desc() ? h('p', { class: 'friend-desc' }, desc()) : null,
            tags.length
              ? h('div', { class: 'fr-tags' }, tags.map((tg, ti) => h('span', { class: 'fr-tag', key: ti }, tg)))
              : null,
            (p.socials?.length || p.website)
              ? h(SocialLinks, { socials: p.socials, website: p.website, accent: p.accent })
              : null,
          ]),
        ]
      );
    };
  },
});
</script>

<style scoped>
.inspirations { padding: var(--space-24) 1.5rem; }
.insp-inner { max-width: 1200px; margin: 0 auto; }

.sec-header { margin-bottom: var(--space-6); }
.sec-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.sec-header p { color: var(--text-muted); font-size: var(--font-size-lg); max-width: 60ch; }

.insp-search {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 420px;
  margin-bottom: var(--space-6);
}
.insp-search-ico { position: absolute; left: 0.85rem; color: var(--text-dim); pointer-events: none; }
.insp-search-input {
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
.insp-search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}
.insp-search-count {
  position: absolute;
  right: 0.75rem;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-dim);
}

.insp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}
.insp-empty {
  text-align: center;
  color: var(--text-dim);
  font-size: var(--font-size-sm);
  padding: var(--space-8) 0;
}

/* Inspiration signature — a haloed avatar + a north-star glyph instead of a text
   chip. Self-contained (no overlap) and tinted from the card accent, so it reads
   as "someday / on the radar" and fits every theme. */
.insp-name { min-width: 0; word-break: break-word; font-size: var(--font-size-base); font-weight: 600; }
.insp-ava { position: relative; flex-shrink: 0; }
.insp-grid .friend-avatar {
  box-shadow:
    0 0 0 2px var(--bg-card),
    0 0 0 4px color-mix(in srgb, var(--card-accent, var(--primary)) 45%, transparent);
}
.insp-star {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.72rem;
  line-height: 1;
  color: var(--card-accent, var(--primary));
  text-shadow: 0 0 6px color-mix(in srgb, var(--card-accent, var(--primary)) 60%, transparent);
  pointer-events: none;
  animation: inspTwinkle 3.2s ease-in-out infinite;
}
@keyframes inspTwinkle {
  0%, 100% { opacity: 0.55; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}
@media (prefers-reduced-motion: reduce) { .insp-star { animation: none; } }
/* a light accent wash on the tag chips so they sit in the theme, not on top of it */
.insp-grid .fr-tag {
  border-color: color-mix(in srgb, var(--card-accent, var(--primary)) 30%, var(--border));
  color: color-mix(in srgb, var(--card-accent, var(--primary)) 55%, var(--text-muted));
}

[data-theme="win95"] .insp-search-input { border-radius: 0; background: #FFF; color: #000; border: 2px solid; border-color: #808080 #DFDFDF #DFDFDF #808080; }
[data-theme="macclassic"] .insp-search-input { border-radius: 0; border: 1px solid #000; background: #FFF; color: #000; }
[data-theme="terminal"] .insp-search-input { border-radius: 0; background: #1A1B26; border: 1px solid rgba(57,197,187,0.2); color: #A9B1D6; }
</style>
