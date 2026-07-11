<template>
  <Teleport to="body">
    <div v-if="isMac" class="mac">
      <!-- Spotlight -->
      <Transition name="mac-fade">
        <div v-if="spotOpen" class="mac-spot-scrim" @click.self="spotOpen = false">
          <div class="mac-spot">
            <div class="mac-spot-bar">
              <span class="mac-spot-ico">⌕</span>
              <input
                ref="spotInput"
                v-model="query"
                class="mac-spot-input"
                type="text"
                placeholder="Spotlight Search"
                @keydown.enter="openFirst"
                @keydown.esc="spotOpen = false"
              />
            </div>
            <div v-if="filtered.length" class="mac-spot-results">
              <a
                v-for="(r, i) in filtered"
                :key="r.name"
                :href="r.url"
                :target="r.url.startsWith('#') ? '_self' : '_blank'"
                rel="noopener"
                class="mac-spot-row"
                :class="{ active: i === 0 }"
                @click="spotOpen = false"
              >
                <span class="mac-spot-tile" :style="{ background: r.color }">{{ r.glyph }}</span>
                <span class="mac-spot-txt"><b>{{ r.name }}</b><small>{{ r.hint }}</small></span>
                <span class="mac-spot-kind">{{ r.kind }}</span>
              </a>
            </div>
          </div>
        </div>
      </Transition>

      <!-- About This Mac -->
      <Transition name="mac-fade">
        <div v-if="aboutOpen" class="mac-about-scrim" @click.self="aboutOpen = false">
          <div class="mac-about">
            <div class="mac-about-glyph">✦</div>
            <h3>VAI OS</h3>
            <p class="mac-about-ver">macOS 26 “Tahoe” · Liquid Glass · in space</p>
            <dl class="mac-about-specs">
              <div><dt>Chip</dt><dd>VAI M4 “Miku” · 39 cores</dd></div>
              <div><dt>Memory</dt><dd>∞ GB of good vibes</dd></div>
              <div><dt>Startup Disk</dt><dd>vai-rice.space</dd></div>
              <div><dt>Coffee</dt><dd>brewing…</dd></div>
            </dl>
            <button class="mac-about-close" @click="aboutOpen = false">Close</button>
          </div>
        </div>
      </Transition>

      <!-- Dock -->
      <div class="mac-dock">
        <button
          v-for="d in dock"
          :key="d.name"
          class="mac-dock-item"
          :data-label="d.name"
          @click="d.action ? d.action() : go(d.url)"
        >
          <span class="mac-dock-tile" :style="{ background: d.color }">{{ d.glyph }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';

const store = usePreferencesStore();
const isMac = computed(() => store.theme === 'macos26');

const spotOpen = ref(false);
const aboutOpen = ref(false);
const query = ref('');
const spotInput = ref<HTMLInputElement | null>(null);

const results = [
  { name: 'Projects', hint: 'What I build', kind: 'Section', glyph: '{ }', color: 'linear-gradient(135deg,#7AA2FF,#4C6FFF)', url: '#projects' },
  { name: 'Friends', hint: 'People who inspire', kind: 'Section', glyph: 'F', color: 'linear-gradient(135deg,#C4A2FF,#8B5CF6)', url: '#friends' },
  { name: 'Communities', hint: 'Where I hang out', kind: 'Section', glyph: '◎', color: 'linear-gradient(135deg,#6EE7E7,#22C1C3)', url: '#communities' },
  { name: 'Blog', hint: 'Notes & updates', kind: 'Page', glyph: 'B', color: 'linear-gradient(135deg,#A78BFA,#7C3AED)', url: '/blog/' },
  { name: 'Contact', hint: 'Say hi', kind: 'Section', glyph: '@', color: 'linear-gradient(135deg,#7CF0B0,#10B981)', url: '#contact' },
  { name: 'GitHub', hint: 'Open source', kind: 'Web', glyph: 'G', color: 'linear-gradient(135deg,#8b95a5,#2B3137)', url: 'https://github.com/Vadim-Khristenko' },
];
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return results;
  return results.filter((r) => r.name.toLowerCase().includes(q) || r.hint.toLowerCase().includes(q));
});

const dock = [
  { name: 'Spotlight', glyph: '⌕', color: 'linear-gradient(135deg,#eef2ff,#c7d2fe)', action: () => (spotOpen.value = true) },
  { name: 'Projects', glyph: '{ }', color: 'linear-gradient(135deg,#7AA2FF,#4C6FFF)', url: '#projects' },
  { name: 'Friends', glyph: 'F', color: 'linear-gradient(135deg,#C4A2FF,#8B5CF6)', url: '#friends' },
  { name: 'Communities', glyph: '◎', color: 'linear-gradient(135deg,#6EE7E7,#22C1C3)', url: '#communities' },
  { name: 'Blog', glyph: 'B', color: 'linear-gradient(135deg,#A78BFA,#7C3AED)', url: '/blog/' },
  { name: 'Contact', glyph: '@', color: 'linear-gradient(135deg,#7CF0B0,#10B981)', url: '#contact' },
  { name: 'About This Mac', glyph: 'ⓘ', color: 'linear-gradient(135deg,#FFD27A,#FF9E64)', action: () => { aboutOpen.value = true; store.findEasterEgg('aboutmac'); } },
];

function go(url?: string) {
  if (!url) return;
  if (url.startsWith('#')) document.querySelector(url)?.scrollIntoView({ behavior: 'smooth' });
  else window.open(url, '_blank', 'noopener');
}
function openFirst() {
  const first = filtered.value[0];
  if (first) { go(first.url); spotOpen.value = false; }
}

watch(spotOpen, (v) => {
  if (v) { store.findEasterEgg('spotlight'); nextTick(() => spotInput.value?.focus()); }
  else query.value = '';
});

function onKey(e: KeyboardEvent) {
  if (!isMac.value) return;
  const el = e.target as HTMLElement | null;
  const typing = el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); spotOpen.value = !spotOpen.value; }
  else if (e.key === 'Escape') { spotOpen.value = false; aboutOpen.value = false; }
  else if (!typing && e.key === '/') { e.preventDefault(); spotOpen.value = true; }
}

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<style scoped>
.mac { font-family: -apple-system, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif; }

/* ── Dock ── */
.mac-dock {
  position: fixed;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  z-index: 1200;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 22px;
  backdrop-filter: blur(40px) saturate(1.8);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.mac-dock-item {
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  transition: transform 0.32s cubic-bezier(0.34, 1.4, 0.4, 1);
  transform-origin: bottom center;
  will-change: transform;
}
.mac-dock-tile {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  color: #0b1030;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 6px 14px rgba(0, 0, 0, 0.3);
}
/* magnification (both neighbours lift too) */
.mac-dock-item:hover { transform: scale(1.5) translateY(-14px); }
.mac-dock-item:hover + .mac-dock-item,
.mac-dock-item:has(+ .mac-dock-item:hover) { transform: scale(1.25) translateY(-7px); }
.mac-dock-item::after {
  content: attr(data-label);
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  padding: 4px 10px;
  background: rgba(28, 28, 42, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  color: #fff;
  font-size: 0.72rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.mac-dock-item:hover::after { opacity: 1; }

@media (max-width: 640px) {
  .mac-dock { gap: 4px; padding: 6px 8px; }
  .mac-dock-tile { width: 40px; height: 40px; font-size: 0.9rem; }
}

/* ── Spotlight ── */
.mac-spot-scrim {
  position: fixed; inset: 0; z-index: 1350;
  display: flex; justify-content: center; align-items: flex-start;
  padding-top: 18vh;
  background: rgba(5, 6, 14, 0.35);
  backdrop-filter: blur(6px);
}
.mac-spot {
  width: min(600px, 92vw);
  background: rgba(30, 30, 46, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  backdrop-filter: blur(60px) saturate(1.8);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  overflow: hidden;
}
.mac-spot-bar { display: flex; align-items: center; gap: 12px; padding: 16px 20px; }
.mac-spot-ico { font-size: 1.4rem; color: rgba(255, 255, 255, 0.6); }
.mac-spot-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 400;
}
.mac-spot-input::placeholder { color: rgba(255, 255, 255, 0.4); }
.mac-spot-results { border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 6px; }
.mac-spot-row {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  text-decoration: none;
  color: #fff;
}
.mac-spot-row.active, .mac-spot-row:hover { background: rgba(122, 162, 255, 0.28); }
.mac-spot-tile { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; color: #0b1030; font-weight: 700; font-size: 0.8rem; }
.mac-spot-txt { display: flex; flex-direction: column; line-height: 1.15; }
.mac-spot-txt b { font-weight: 600; font-size: 0.9rem; }
.mac-spot-txt small { color: rgba(255, 255, 255, 0.55); font-size: 0.72rem; }
.mac-spot-kind { margin-left: auto; color: rgba(255, 255, 255, 0.4); font-size: 0.72rem; }

/* ── About This Mac ── */
.mac-about-scrim {
  position: fixed; inset: 0; z-index: 1350;
  display: grid; place-items: center;
  background: rgba(5, 6, 14, 0.4);
  backdrop-filter: blur(6px);
}
.mac-about {
  width: min(380px, 92vw);
  padding: 32px 28px;
  text-align: center;
  color: #fff;
  background: rgba(30, 30, 46, 0.66);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 22px;
  backdrop-filter: blur(60px) saturate(1.8);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}
.mac-about-glyph { font-size: 3rem; color: #7AA2FF; text-shadow: 0 0 30px rgba(122,162,255,0.6); margin-bottom: 0.5rem; }
.mac-about h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem; }
.mac-about-ver { color: rgba(255, 255, 255, 0.6); font-size: 0.8rem; margin-bottom: 1.5rem; }
.mac-about-specs { text-align: left; display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem; }
.mac-about-specs div { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.85rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 6px; }
.mac-about-specs dt { color: rgba(255, 255, 255, 0.55); }
.mac-about-specs dd { color: #fff; text-align: right; }
.mac-about-close {
  padding: 8px 24px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(122, 162, 255, 0.85);
  color: #08122e;
  font-weight: 600;
  cursor: pointer;
}

/* transitions */
.mac-fade-enter-active, .mac-fade-leave-active { transition: opacity 0.2s ease; }
.mac-fade-enter-from, .mac-fade-leave-to { opacity: 0; }
</style>
