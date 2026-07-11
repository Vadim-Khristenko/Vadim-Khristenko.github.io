<template>
  <Teleport to="body">
    <div v-if="isWin11" class="w11">
      <!-- Start menu -->
      <Transition name="w11-start">
        <div v-if="startOpen" class="w11-start-scrim" @click.self="startOpen = false">
          <div class="w11-start">
            <div class="w11-search"><span class="w11-search-ico">⌕</span> Search for apps, settings, and documents</div>

            <div class="w11-row-label">Pinned</div>
            <div class="w11-pinned">
              <a
                v-for="app in pinned"
                :key="app.name"
                :href="app.url"
                :target="app.url.startsWith('#') ? '_self' : '_blank'"
                rel="noopener"
                class="w11-app"
                @click="startOpen = false"
              >
                <span class="w11-tile" :style="{ background: app.color }">{{ app.tile }}</span>
                <span class="w11-app-name">{{ app.name }}</span>
              </a>
            </div>

            <div class="w11-start-footer">
              <span class="w11-user"><span class="w11-user-dot"></span> VAI_PROG</span>
              <button class="w11-power" title="Shut down" @click="doBsod">⏻</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Taskbar -->
      <div class="w11-taskbar">
        <div class="w11-tb-center">
          <button class="w11-tb-btn w11-start-btn" :class="{ active: startOpen }" title="Start" @click="startOpen = !startOpen">
            <WinLogo />
          </button>
          <button
            v-for="app in taskApps"
            :key="app.name"
            class="w11-tb-btn"
            :title="app.name"
            @click="go(app.url)"
          >
            <span class="w11-tb-tile" :style="{ background: app.color }">{{ app.tile }}</span>
          </button>
        </div>
        <div class="w11-tb-tray">
          <span class="w11-chevron">⌃</span>
          <span class="w11-clock">
            <span>{{ clock }}</span>
            <span>{{ dateStr }}</span>
          </span>
        </div>
      </div>

      <!-- BSOD -->
      <Transition name="w11-fade">
        <div v-if="bsodOn" class="w11-bsod" @click="bsodOn = false">
          <div class="w11-bsod-inner">
            <div class="w11-sad">:(</div>
            <p class="w11-bsod-main">Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</p>
            <div class="w11-bsod-progress">
              <div class="w11-spinner"><i v-for="d in 8" :key="d" :style="{ transform: `rotate(${(d - 1) * 45}deg) translateY(-15px)`, opacity: 0.2 + (d / 8) * 0.8 }"></i></div>
              <p class="w11-bsod-pct">{{ bsodPct }}% complete</p>
            </div>
            <div class="w11-bsod-more">
              <div class="w11-qr" aria-hidden="true"></div>
              <div class="w11-bsod-info">
                <p>For more information about this issue and possible fixes, visit vai-rice.space</p>
                <p>If you call a support person, give them this info:</p>
                <p class="w11-stop">Stop code: NYA_CATGIRL_EXCEPTION</p>
                <p class="w11-dismiss">(click anywhere to recover)</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';
import WinLogo from './WinLogo.vue';

const store = usePreferencesStore();
const isWin11 = computed(() => store.theme === 'win11');

const startOpen = ref(false);
const bsodOn = ref(false);
const bsodPct = ref(0);
const clock = ref('--:--');
const dateStr = ref('');

const pinned = [
  { name: 'Projects', tile: '{ }', color: '#0078D4', url: '#projects' },
  { name: 'Blog', tile: 'B', color: '#8B5CF6', url: '/blog/' },
  { name: 'GitHub', tile: 'G', color: '#2B3137', url: 'https://github.com/Vadim-Khristenko' },
  { name: 'Contact', tile: '@', color: '#10B981', url: '#contact' },
  { name: 'Snackers Wiki', tile: 'S', color: '#FF5FA2', url: 'https://snackers.vai-rice.space' },
  { name: 'Editor', tile: 'E', color: '#F59E0B', url: '/editor' },
];
const taskApps = [
  { name: 'Projects', tile: '{ }', color: '#0078D4', url: '#projects' },
  { name: 'Friends', tile: 'F', color: '#8B5CF6', url: '#friends' },
  { name: 'Contact', tile: '@', color: '#10B981', url: '#contact' },
];

let timers: number[] = [];
function go(url: string) {
  if (url.startsWith('#')) {
    document.querySelector(url)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.open(url, '_blank', 'noopener');
  }
}

function tick() {
  const n = new Date();
  const p = (v: number) => String(v).padStart(2, '0');
  clock.value = `${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`;
  dateStr.value = `${p(n.getDate())}.${p(n.getMonth() + 1)}.${n.getFullYear()}`;
}

function doBsod() {
  startOpen.value = false;
  bsodOn.value = true;
  bsodPct.value = 0;
  store.findEasterEgg('bsod');
  const iv = window.setInterval(() => {
    bsodPct.value += Math.max(1, Math.round((100 - bsodPct.value) * 0.08));
    if (bsodPct.value >= 100) {
      bsodPct.value = 100;
      clearInterval(iv);
      // stays at 100% until the user clicks to "recover" (overlay has @click)
    }
  }, 260);
  timers.push(iv);
}

function onKey(e: KeyboardEvent) {
  if (!isWin11.value) return;
  const el = e.target as HTMLElement | null;
  if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
  if (e.key === 'Meta' || e.key === 'OS') { e.preventDefault(); startOpen.value = !startOpen.value; }
  else if (e.key === 'Escape') startOpen.value = false;
}

let clockIv = 0;
onMounted(() => {
  tick();
  clockIv = window.setInterval(tick, 1000);
  window.addEventListener('keydown', onKey);
});
onUnmounted(() => {
  clearInterval(clockIv);
  timers.forEach(clearTimeout);
  window.removeEventListener('keydown', onKey);
});
</script>

<style scoped>
.w11 {
  font-family: 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif;
}

/* ── taskbar ── */
.w11-taskbar {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  height: 48px;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(32, 32, 32, 0.72);
  backdrop-filter: blur(40px) saturate(1.6);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.w11-tb-center { display: flex; align-items: center; gap: 4px; }
.w11-tb-tray {
  position: absolute;
  right: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}
.w11-tb-btn {
  width: 40px; height: 40px;
  border: none;
  border-radius: 6px;
  background: transparent;
  display: grid; place-items: center;
  cursor: pointer;
  transition: background 0.12s ease;
}
.w11-tb-btn:hover { background: rgba(255, 255, 255, 0.08); }
.w11-start-btn.active { background: rgba(255, 255, 255, 0.1); }
.w11-tb-tile, .w11-tile {
  display: grid; place-items: center;
  color: #fff;
  font-weight: 700;
  border-radius: 6px;
}
.w11-tb-tile { width: 24px; height: 24px; font-size: 0.7rem; }
.w11-chevron { font-size: 0.9rem; opacity: 0.8; }
.w11-clock {
  display: flex; flex-direction: column; align-items: flex-end;
  font-size: 0.72rem; line-height: 1.25;
  font-variant-numeric: tabular-nums;
}

/* ── start menu ── */
.w11-start-scrim { position: fixed; inset: 0; z-index: 1250; }
.w11-start {
  position: fixed;
  left: 50%;
  bottom: 60px;
  transform: translateX(-50%);
  width: min(560px, 94vw);
  padding: 22px;
  background: rgba(43, 43, 43, 0.86);
  backdrop-filter: blur(50px) saturate(1.6);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 10px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.45);
  color: #fff;
}
.w11-search {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.82rem;
  margin-bottom: 16px;
}
.w11-search-ico { font-size: 1rem; }
.w11-row-label { font-size: 0.8rem; font-weight: 600; margin-bottom: 12px; }
.w11-pinned {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-bottom: 18px;
}
.w11-app {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 12px 4px;
  border-radius: 8px;
  text-decoration: none;
  color: #fff;
  transition: background 0.12s ease;
}
.w11-app:hover { background: rgba(255, 255, 255, 0.06); }
.w11-tile { width: 34px; height: 34px; font-size: 0.9rem; }
.w11-app-name { font-size: 0.68rem; text-align: center; opacity: 0.9; }
.w11-start-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.w11-user { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; }
.w11-user-dot {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #0078D4, #8B5CF6);
}
.w11-power {
  width: 34px; height: 34px; border-radius: 6px;
  border: none; background: transparent; color: #fff;
  font-size: 1rem; cursor: pointer;
}
.w11-power:hover { background: rgba(255, 255, 255, 0.08); }

@media (max-width: 560px) {
  .w11-pinned { grid-template-columns: repeat(4, 1fr); }
  .w11-tb-tray .w11-chevron { display: none; }
}

/* ── BSOD ── */
.w11-bsod {
  position: fixed; inset: 0; z-index: 1400;
  background: #0078D4;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-family: 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif;
}
.w11-bsod-inner { max-width: 720px; padding: 6vw; }
.w11-sad { font-size: clamp(4rem, 12vw, 7rem); font-weight: 300; margin-bottom: 1.5rem; }
.w11-bsod-main { font-size: clamp(1.1rem, 2.4vw, 1.5rem); font-weight: 400; line-height: 1.4; margin-bottom: 1.5rem; }
.w11-bsod-progress { display: flex; align-items: center; gap: 1.1rem; margin-bottom: 2rem; }
.w11-bsod-pct { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 300; }
.w11-spinner {
  position: relative;
  width: 42px; height: 42px;
  flex-shrink: 0;
  animation: w11spin 1.3s steps(8) infinite;
}
.w11-spinner i {
  position: absolute;
  top: 50%; left: 50%;
  width: 5px; height: 5px;
  margin: -2.5px;
  border-radius: 50%;
  background: #fff;
  transform-origin: center;
}
@keyframes w11spin { to { transform: rotate(360deg); } }
.w11-bsod-more { display: flex; gap: 1.5rem; align-items: flex-start; }
.w11-qr {
  width: 90px; height: 90px; flex-shrink: 0;
  background:
    conic-gradient(#000 90deg, #fff 90deg 180deg, #000 180deg 270deg, #fff 270deg) 0 0 / 18px 18px,
    #fff;
  border: 4px solid #fff;
}
.w11-bsod-info p { font-size: 0.8rem; line-height: 1.5; opacity: 0.92; margin-bottom: 0.3rem; }
.w11-stop { font-family: 'Cascadia Code', monospace; opacity: 1 !important; }
.w11-dismiss { opacity: 0.7 !important; margin-top: 0.6rem; }

/* transitions */
.w11-start-enter-active, .w11-start-leave-active { transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.2, 0.9, 0.3, 1); }
.w11-start-enter-from, .w11-start-leave-to { opacity: 0; }
.w11-start-enter-from .w11-start, .w11-start-leave-to .w11-start { transform: translate(-50%, 16px); opacity: 0; }
.w11-fade-enter-active, .w11-fade-leave-active { transition: opacity 0.2s ease; }
.w11-fade-enter-from, .w11-fade-leave-to { opacity: 0; }
</style>
