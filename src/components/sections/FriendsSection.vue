<template>
  <section id="friends" class="friends">
    <div class="friends-inner">
      <header class="sec-header">
        <h2>{{ t('friends.title') }}</h2>
        <p>{{ t('friends.subtitle') }}</p>
      </header>

      <!-- Search -->
      <div class="fr-search">
        <Search :size="16" class="fr-search-ico" />
        <input
          v-model="q"
          type="search"
          class="fr-search-input"
          :placeholder="t('friends.search')"
          :aria-label="t('friends.search')"
        />
        <span v-if="q" class="fr-search-count">{{ bestFriends.length + regularFriends.length }}</span>
      </div>

      <!-- Best friends -->
      <template v-if="bestFriends.length">
        <div class="group-label">
          <Star :size="13" class="group-star" />
          {{ t('friends.best') }}
        </div>
        <div class="friends-grid best-grid">
          <FriendCard v-for="(f, i) in bestFriends" :key="'b' + i" :friend="f" best />
        </div>
      </template>

      <!-- Regular friends -->
      <template v-if="regularFriends.length">
        <div class="group-label">{{ t('friends.more') }}</div>
        <div class="friends-grid">
          <FriendCard v-for="(f, i) in regularFriends" :key="i" :friend="f" />
        </div>
      </template>

      <p v-if="!anyResults" class="fr-empty">{{ t('friends.noResults') }}</p>

      <!-- Easy add hint -->
      <div class="add-friend-hint">
        <p>{{ t('friends.addHint') }}</p>
        <a
          href="https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/issues/new?template=suggest-friend.yml"
          target="_blank"
          rel="noopener"
          class="add-link"
        >
          <Plus :size="14" />
          {{ t('friends.addMe') }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue';
import { Plus, Star, Cake, MapPin, Search } from 'lucide-vue-next';
import { useI18n } from '@/composables/useI18n';
import { friends } from '@/data/friends';
import type { Friend } from '@/data/types';
import SocialLinks from '../ui/SocialLinks.vue';

const { t, tl } = useI18n();

const PLACEHOLDER = '/avatars/PHOTO_NOT_FOUND.png';
const q = ref('');

function nameOf(f: Friend): string {
  return tl(f.name);
}
function tagsOf(f: Friend): string[] {
  return (f.tags ?? []).map((tag) => tl(tag)).filter(Boolean);
}
function matches(f: Friend): boolean {
  const needle = q.value.trim().toLowerCase();
  if (!needle) return true;
  const role = f.roleKey ? t(f.roleKey as any) : tl(f.role);
  const desc = f.descKey ? t(f.descKey as any) : tl(f.desc);
  const loc = f.location ? tl(f.location) : '';
  const hay = [nameOf(f), role, desc, loc, ...tagsOf(f)].join(' ').toLowerCase();
  return hay.includes(needle);
}

const bestFriends = computed(() => friends.filter((f) => f.tier === 'best' && matches(f)));
const regularFriends = computed(() => friends.filter((f) => f.tier !== 'best' && matches(f)));
const anyResults = computed(() => bestFriends.value.length + regularFriends.value.length > 0);

/** Live age from a birthday (YYYY-MM-DD); falls back to an explicit age. */
function ageOf(f: Friend): number | null {
  if (f.birthday) {
    const b = new Date(f.birthday);
    if (!isNaN(b.getTime())) {
      const now = new Date();
      let a = now.getFullYear() - b.getFullYear();
      const m = now.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
      if (a >= 0 && a < 130) return a;
    }
  }
  return typeof f.age === 'number' ? f.age : null;
}

// Local presentational card (kept in-file; consumes the shared Friend model)
const FriendCard = defineComponent({
  props: {
    friend: { type: Object as () => Friend, required: true },
    best: { type: Boolean, default: false },
  },
  setup(props) {
    const f = props.friend;
    const accent = f.accent || 'var(--primary)';
    const role = () => (f.roleKey ? t(f.roleKey as any) : tl(f.role));
    const desc = () => (f.descKey ? t(f.descKey as any) : tl(f.desc));

    return () => {
      const nm = nameOf(f);
      const age = ageOf(f);
      const loc = f.location ? tl(f.location) : '';
      const tags = tagsOf(f);
      const badge = f.badge ? tl(f.badge) : '';
      const facts = [
        age != null ? h('span', { class: 'friend-fact' }, [h(Cake, { size: 12 }), ` ${age}`]) : null,
        loc ? h('span', { class: 'friend-fact' }, [h(MapPin, { size: 12 }), ` ${loc}`]) : null,
      ].filter(Boolean);

      return h(
        'div',
        {
          class: ['friend-card', { best: props.best, 'has-banner': !!f.banner }],
          style: { '--card-accent': accent },
        },
        [
          f.banner
            ? h('div', { class: 'fr-banner', style: { backgroundImage: `url(${f.banner})` } })
            : null,
          h('div', { class: 'fr-body' }, [
            h('div', { class: 'friend-top' }, [
              h(
                'div',
                { class: 'friend-avatar', style: { background: `${accent}1F`, color: accent } },
                [h('img', { src: f.avatar || PLACEHOLDER, alt: nm, loading: 'lazy' })]
              ),
              h('div', { class: 'friend-meta' }, [
                h('h4', { class: 'friend-name-row' }, [
                  h('span', { class: 'friend-name' }, nm),
                  props.best ? h('span', { class: 'friend-best' }, [h(Star, { size: 10 }), ' BEST']) : null,
                  badge ? h('span', { class: 'friend-badge' }, badge) : null,
                ]),
                role() ? h('span', { class: 'friend-role' }, role()) : null,
                facts.length ? h('div', { class: 'friend-facts' }, facts) : null,
              ]),
            ]),
            desc() ? h('p', { class: 'friend-desc' }, desc()) : null,
            tags.length
              ? h('div', { class: 'fr-tags' }, tags.map((tg, ti) => h('span', { class: 'fr-tag', key: ti }, tg)))
              : null,
            (f.socials?.length || f.website)
              ? h(SocialLinks, { socials: f.socials, website: f.website, accent: f.accent })
              : null,
          ]),
        ]
      );
    };
  },
});
</script>

<style scoped>
.friends { padding: var(--space-24) 1.5rem; }
.friends-inner { max-width: 1200px; margin: 0 auto; }

.sec-header { margin-bottom: var(--space-8); }
.sec-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.sec-header p { color: var(--text-muted); font-size: var(--font-size-lg); }

/* Search */
.fr-search {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 420px;
  margin-bottom: var(--space-6);
}
.fr-search-ico { position: absolute; left: 0.85rem; color: var(--text-dim); pointer-events: none; }
.fr-search-input {
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
.fr-search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}
.fr-search-count {
  position: absolute;
  right: 0.75rem;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-dim);
}
.fr-empty {
  text-align: center;
  color: var(--text-dim);
  font-size: var(--font-size-sm);
  padding: var(--space-8) 0;
}
[data-theme="win95"] .fr-search-input { border-radius: 0; background: #FFF; color: #000; border: 2px solid; border-color: #808080 #DFDFDF #DFDFDF #808080; }
[data-theme="macclassic"] .fr-search-input { border-radius: 0; border: 1px solid #000; background: #FFF; color: #000; }
[data-theme="terminal"] .fr-search-input { border-radius: 0; background: #1A1B26; border: 1px solid rgba(57,197,187,0.2); color: #A9B1D6; }

.group-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--text-dim);
  margin: var(--space-6) 0 var(--space-3);
}
.group-label:first-of-type { margin-top: 0; }
.group-star { color: var(--accent-warm, #FBBF24); }

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}
.best-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }

/* Add friend hint */
.add-friend-hint {
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
.add-friend-hint p { font-size: var(--font-size-sm); color: var(--text-muted); }
.add-link {
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
.add-link:hover { background: var(--primary); color: #fff; }

@media (max-width: 640px) {
  .friends { padding: var(--space-16) 1rem; }
  .friends-grid, .best-grid { grid-template-columns: 1fr; }
}

/* add-hint theme overrides (this element is local to the section) */
[data-theme="win95"] .add-friend-hint {
  border-radius: 0;
  border: 2px dashed #808080;
  background: #C0C0C0;
}
[data-theme="macclassic"] .add-friend-hint {
  border-radius: 0;
  border: 1px dashed #000;
  background: #FFF;
}
[data-theme="classic"] .add-friend-hint {
  background: #FFFFFF;
  border: 1px dashed rgba(0,0,0,0.1);
  border-radius: var(--radius-lg);
}
</style>

<!-- Card styles are GLOBAL: the cards are rendered by an in-file render
     component (no scope id), so scoped :deep + [data-theme] would not match. -->
<style>
.friend-card {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-top: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-xl);
  transition: transform var(--transition-base), border-color var(--transition-fast), box-shadow var(--transition-base);
}
.fr-body { padding: var(--space-6); }
.fr-banner {
  height: 84px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.fr-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--bg-card) 92%, transparent));
}
.friend-card.has-banner .fr-body { padding-top: 0; margin-top: -22px; position: relative; z-index: 1; }
.friend-card.has-banner .friend-avatar {
  border: 3px solid var(--bg-card);
  box-shadow: var(--shadow-sm);
}
.fr-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: var(--space-3); }
.fr-tag {
  padding: 0.2rem 0.55rem;
  background: color-mix(in srgb, var(--card-accent) 8%, transparent);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
.friend-card:hover {
  transform: translateY(-4px);
  border-color: var(--card-accent, var(--border-hover));
  box-shadow: var(--shadow-md);
}
.friend-card.best {
  border-top-width: 4px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--card-accent) 7%, transparent), transparent 60%),
    var(--bg-card);
}
.friend-best {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.12rem 0.4rem;
  color: var(--card-accent);
  background: color-mix(in srgb, var(--card-accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--card-accent) 35%, transparent);
  border-radius: var(--radius-full);
}
.friend-name-row .friend-name { min-width: 0; word-break: break-word; }
.friend-top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.friend-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  flex-shrink: 0;
  overflow: hidden;
}
.friend-avatar img { width: 100%; height: 100%; object-fit: cover; }
.friend-meta h4 { font-size: var(--font-size-base); font-weight: 600; }
.friend-name-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.friend-badge {
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-full);
  color: var(--card-accent, var(--primary));
  background: color-mix(in srgb, var(--card-accent) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--card-accent) 38%, transparent);
  white-space: nowrap;
}
.friend-role { font-size: var(--font-size-xs); color: var(--text-dim); }
.friend-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.2rem;
}
.friend-fact {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}
.friend-fact svg { color: var(--card-accent, var(--primary)); opacity: 0.8; }
.friend-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: var(--space-3);
}

/* ── theme overrides (Modern handled in modern.css) ── */
html[data-theme="win95"] .friend-card {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
  color: #000;
}
html[data-theme="win95"] .friend-desc,
html[data-theme="win95"] .friend-role { color: #404040; }

html[data-theme="macclassic"] .friend-card {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
  box-shadow: 2px 2px 0 #000;
}
html[data-theme="macclassic"] .friend-avatar { border: 1px solid #000; }

html[data-theme="classic"] .friend-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-top: 3px solid var(--card-accent, var(--primary));
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

html[data-theme="terminal"] .friend-card {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.15);
  border-top: 2px solid var(--card-accent, #39C5BB);
  background: #24283B;
  font-family: var(--font-mono);
}
html[data-theme="terminal"] .friend-desc { color: #787C99; }
html[data-theme="terminal"] .friend-role { color: #565970; }
html[data-theme="terminal"] .friend-avatar { border: 1px solid rgba(57,197,187,0.25); }
</style>
