<template>
  <Teleport to="body">
    <div v-if="isWin95" class="w95">
      <!-- Start menu -->
      <Transition name="w95-start">
        <div v-if="startOpen" class="w95-start-scrim" @click.self="startOpen = false">
          <div class="w95-start">
            <div class="w95-banner"><span>Windows<b>95</b></span></div>
            <ul class="w95-menu">
              <li v-for="item in menu" :key="item.name" class="w95-item" @click="item.action ? item.action() : go(item.url)">
                <span class="w95-item-ico" :style="{ background: item.color }">{{ item.glyph }}</span>
                <span class="w95-item-name">{{ item.name }}{{ item.sub ? '…' : '' }}</span>
                <span v-if="item.arrow" class="w95-item-arrow">▶</span>
              </li>
              <li class="w95-sep"></li>
              <li class="w95-item w95-shutdown" @click="doShutdown">
                <span class="w95-item-ico" style="background:#C0C0C0">⏻</span>
                <span class="w95-item-name">Sh<u>u</u>t Down…</span>
              </li>
            </ul>
          </div>
        </div>
      </Transition>

      <!-- Taskbar -->
      <div class="w95-taskbar">
        <button class="w95-start-btn" :class="{ active: startOpen }" @click="startOpen = !startOpen">
          <WinFlag /><b>Start</b>
        </button>
        <div class="w95-tasks">
          <button v-for="t in tasks" :key="t.name" class="w95-task" @click="go(t.url)">
            <span class="w95-task-ico" :style="{ background: t.color }">{{ t.glyph }}</span>{{ t.name }}
          </button>
        </div>
        <div class="w95-tray">
          <span class="w95-tray-ico">♪</span>
          <span class="w95-clock">{{ clock }}</span>
        </div>
      </div>

      <!-- Win95 BSOD -->
      <Transition name="w95-fade">
        <div v-if="bsodOn" class="w95-bsod" @click="bsodOn = false" @keydown="bsodOn = false" tabindex="0">
          <div class="w95-bsod-inner">
            <div class="w95-bsod-title">Windows</div>
            <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
              00010E36. The current application will be terminated.</p>
            <ul>
              <li>*  Press any key to terminate the current application.</li>
              <li>*  Press CTRL+ALT+DEL again to restart your computer. You will
                lose any unsaved information in all applications.</li>
            </ul>
            <p class="w95-bsod-mid">Cause: too much cuteness. Stop code: NYA_CATGIRL_0E</p>
            <p class="w95-bsod-press">Press any key to continue <span class="w95-cursor">_</span></p>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';
import WinFlag from './WinFlag.vue';

const store = usePreferencesStore();
const isWin95 = computed(() => store.theme === 'win95');

const startOpen = ref(false);
const bsodOn = ref(false);
const clock = ref('--:--');

const menu = [
  { name: 'Programs', glyph: '▤', color: '#C0C0C0', arrow: true, url: '#projects' },
  { name: 'Documents', glyph: '▦', color: '#FFF7C0', arrow: true, url: '/blog/' },
  { name: 'Friends', glyph: '☺', color: '#C0E0FF', url: '#friends' },
  { name: 'Find', glyph: '⌕', color: '#C0C0C0', sub: true, url: '#projects' },
  { name: 'Help', glyph: '?', color: '#FFF7C0', url: '#about' },
  { name: 'Run', glyph: '▷', color: '#C0C0C0', sub: true, url: '#contact' },
];
const tasks = [
  { name: 'Projects', glyph: '▤', color: '#C0E0FF', url: '#projects' },
  { name: 'Contact', glyph: '@', color: '#C0FFC0', url: '#contact' },
];

const timers: number[] = [];
function go(url?: string) {
  startOpen.value = false;
  if (!url) return;
  if (url.startsWith('#')) document.querySelector(url)?.scrollIntoView({ behavior: 'smooth' });
  else window.open(url, '_blank', 'noopener');
}
function doShutdown() {
  startOpen.value = false;
  bsodOn.value = true;
  store.findEasterEgg('bsod95');
}

let clockIv = 0;
function tick() {
  const n = new Date();
  const h = n.getHours();
  const m = String(n.getMinutes()).padStart(2, '0');
  const ap = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  clock.value = `${h12}:${m} ${ap}`;
}
function onKey(e: KeyboardEvent) {
  if (!isWin95.value) return;
  if (bsodOn.value) { bsodOn.value = false; return; }
  if (e.key === 'Escape') startOpen.value = false;
}

onMounted(() => {
  tick();
  clockIv = window.setInterval(tick, 15000);
  window.addEventListener('keydown', onKey);
});
onUnmounted(() => {
  clearInterval(clockIv);
  timers.forEach(clearTimeout);
  window.removeEventListener('keydown', onKey);
});
</script>

<style scoped>
.w95 { font-family: 'W95FA', 'MS Sans Serif', Tahoma, 'Segoe UI', sans-serif; }
.w95 button { font-family: inherit; }

/* ── taskbar ── */
.w95-taskbar {
  position: fixed; left: 0; right: 0; bottom: 0;
  height: 34px;
  z-index: 1200;
  display: flex; align-items: center; gap: 4px;
  padding: 3px 4px;
  background: #C0C0C0;
  box-shadow: inset 0 1px 0 #FFFFFF, inset 0 2px 0 #DFDFDF;
  border-top: 1px solid #FFFFFF;
}
.w95-start-btn {
  display: flex; align-items: center; gap: 5px;
  height: 26px;
  padding: 0 8px;
  background: #C0C0C0;
  border: none;
  box-shadow: inset -1px -1px #000, inset 1px 1px #FFF, inset -2px -2px #808080, inset 2px 2px #DFDFDF;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.8rem;
  color: #000;
}
.w95-start-btn.active { box-shadow: inset 1px 1px #000, inset -1px -1px #FFF, inset 2px 2px #808080, inset -2px -2px #DFDFDF; }
.w95-tasks { display: flex; gap: 4px; flex: 1; margin-left: 4px; }
.w95-task {
  display: flex; align-items: center; gap: 5px;
  height: 26px; padding: 0 8px;
  max-width: 160px;
  background: #C0C0C0; border: none;
  box-shadow: inset 1px 1px #000, inset -1px -1px #FFF, inset 2px 2px #808080, inset -2px -2px #DFDFDF;
  font-size: 0.75rem; color: #000; cursor: pointer;
}
.w95-task-ico, .w95-item-ico, .w95-tray-ico {
  display: inline-grid; place-items: center;
  width: 16px; height: 16px; font-size: 0.65rem;
  box-shadow: inset -1px -1px #808080, inset 1px 1px #FFF;
}
.w95-tray {
  display: flex; align-items: center; gap: 6px;
  height: 26px; padding: 0 8px;
  box-shadow: inset 1px 1px #808080, inset -1px -1px #FFF;
  font-size: 0.75rem; color: #000;
}
.w95-tray-ico { box-shadow: none; }
.w95-clock { font-variant-numeric: tabular-nums; }

/* ── start menu ── */
.w95-start-scrim { position: fixed; inset: 0; z-index: 1250; }
.w95-start {
  position: fixed;
  left: 4px; bottom: 38px;
  display: flex;
  background: #C0C0C0;
  box-shadow: inset -1px -1px #000, inset 1px 1px #FFF, inset -2px -2px #808080, inset 2px 2px #DFDFDF;
}
.w95-banner {
  width: 30px;
  background: linear-gradient(#000080, #1084D0 70%, #000080);
  position: relative;
}
.w95-banner span {
  position: absolute; bottom: 8px; left: 50%;
  transform: rotate(-90deg) translateX(0);
  transform-origin: left bottom;
  white-space: nowrap;
  color: #C0C0C0; font-size: 1.1rem; font-weight: 700;
  letter-spacing: 1px;
}
.w95-banner b { color: #fff; margin-left: 4px; }
.w95-menu { list-style: none; padding: 2px; min-width: 200px; }
.w95-item {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 20px 5px 6px;
  font-size: 0.82rem; color: #000; cursor: pointer;
  position: relative;
}
.w95-item:hover { background: #000080; color: #fff; }
.w95-item-arrow { position: absolute; right: 5px; font-size: 0.6rem; }
.w95-item-name u { text-decoration: underline; }
.w95-sep { height: 0; border-top: 1px solid #808080; border-bottom: 1px solid #FFF; margin: 3px 2px; }

/* ── BSOD (Win95 text) ── */
.w95-bsod {
  position: fixed; inset: 0; z-index: 1400;
  background: #0000AA;
  color: #C0C0C0;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-family: 'Consolas', 'Courier New', monospace;
  outline: none;
}
.w95-bsod-inner { max-width: 640px; padding: 5vw; font-size: clamp(0.85rem, 1.6vw, 1rem); line-height: 1.6; }
.w95-bsod-title {
  background: #C0C0C0; color: #0000AA;
  display: inline-block;
  padding: 0 8px; margin: 0 auto 1.5rem;
  font-weight: 700;
  text-align: center;
}
.w95-bsod-inner { text-align: center; }
.w95-bsod-inner p, .w95-bsod-inner ul { text-align: left; margin-bottom: 1rem; }
.w95-bsod-inner ul { list-style: none; }
.w95-bsod-mid { color: #FFF; }
.w95-bsod-press { text-align: center; }
.w95-cursor { animation: w95blink 1s steps(2) infinite; }
@keyframes w95blink { 50% { opacity: 0; } }

/* transitions */
.w95-start-enter-active { transition: transform 0.12s ease, opacity 0.12s ease; }
.w95-start-enter-from .w95-start { transform: translateY(10px); }
.w95-start-enter-from { opacity: 0.6; }
.w95-fade-enter-active, .w95-fade-leave-active { transition: opacity 0.1s steps(2); }
.w95-fade-enter-from, .w95-fade-leave-to { opacity: 0; }

@media (max-width: 560px) { .w95-tasks { display: none; } }

/* ── theme-var overrides so taskbar/start follow light AND dark ── */
html[data-theme="win95"] .w95-taskbar {
  background: var(--win-face);
  border-top-color: var(--win-hi);
  box-shadow: inset 0 1px 0 var(--win-hi), inset 0 2px 0 var(--win-light);
}
html[data-theme="win95"] .w95-start-btn,
html[data-theme="win95"] .w95-task {
  background: var(--win-face);
  color: var(--text);
}
html[data-theme="win95"] .w95-start-btn {
  box-shadow: inset -1px -1px var(--win-dark), inset 1px 1px var(--win-hi),
              inset -2px -2px var(--win-shadow), inset 2px 2px var(--win-light);
}
html[data-theme="win95"] .w95-start-btn.active,
html[data-theme="win95"] .w95-task {
  box-shadow: inset 1px 1px var(--win-dark), inset -1px -1px var(--win-hi),
              inset 2px 2px var(--win-shadow), inset -2px -2px var(--win-light);
}
html[data-theme="win95"] .w95-tray {
  color: var(--text);
  box-shadow: inset 1px 1px var(--win-shadow), inset -1px -1px var(--win-hi);
}
html[data-theme="win95"] .w95-task-ico,
html[data-theme="win95"] .w95-item-ico {
  box-shadow: inset -1px -1px var(--win-shadow), inset 1px 1px var(--win-hi);
}
html[data-theme="win95"] .w95-start {
  background: var(--win-face);
  box-shadow: inset -1px -1px var(--win-dark), inset 1px 1px var(--win-hi),
              inset -2px -2px var(--win-shadow), inset 2px 2px var(--win-light);
}
html[data-theme="win95"] .w95-item { color: var(--text); }
html[data-theme="win95"] .w95-item:hover { background: var(--win-title-a); color: #fff; }
html[data-theme="win95"] .w95-sep { border-top-color: var(--win-shadow); border-bottom-color: var(--win-hi); }
</style>
