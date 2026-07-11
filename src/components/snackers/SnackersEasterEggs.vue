<template>
  <Teleport to="body">
  <div v-if="isSnackers" class="snk-root">
    <!-- pinned, obviously-clickable mascot CTA (bottom-right) -->
    <button class="snk-cta" :class="{ hidden: welchOn }" @click="doWelchs">
      <span class="snk-cta-face"><img class="snk-filian" src="/avatars/Filian_VTUBER.png" alt="Filian" loading="lazy" /></span>
      <span class="snk-cta-txt">
        <b>ONLY WELCH'S</b>
        <small>tap me · nya~</small>
      </span>
    </button>

    <!-- Welch's chaos overlay -->
    <Transition name="snk-fade">
      <div v-if="welchOn" class="snk-welch" @click="welchOn = false">
        <div class="snk-welch-card">
          <span class="snk-welch-mascot"><img class="snk-filian" src="/avatars/Filian_VTUBER.png" alt="Filian" loading="lazy" /></span>
          <p
            v-for="(line, i) in welchLines"
            :key="i"
            class="snk-line"
            :style="{ animationDelay: 0.15 + i * 0.34 + 's' }"
          >{{ line }}</p>
          <span class="snk-close">click anywhere to close</span>
        </div>
      </div>
    </Transition>

    <!-- MODS! banner -->
    <Transition name="snk-drop">
      <div v-if="modsOn" class="snk-mods">
        <span class="snk-mods-face"><img class="snk-filian" src="/avatars/Filian_VTUBER.png" alt="Filian" loading="lazy" /></span>
        <span>MODS!!</span>
      </div>
    </Transition>

    <!-- "I'm in an edit!" clip frame -->
    <Transition name="snk-fade">
      <div v-if="editOn" class="snk-edit">
        <span class="snk-rec"><i class="snk-rec-dot"></i>I'M IN AN EDIT!</span>
      </div>
    </Transition>

    <!-- confetti burst -->
    <div v-if="confetti" class="snk-confetti" aria-hidden="true">
      <i v-for="n in 46" :key="n" :style="confettiStyle(n)"></i>
    </div>

    <!-- keyboard hint -->
    <div class="snk-hint">press <b>M</b> for mods · <b>C</b> to clip · <b>W</b> for Welch's</div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';

const store = usePreferencesStore();
const isSnackers = computed(() => store.theme === 'snackers');

const welchOn = ref(false);
const modsOn = ref(false);
const editOn = ref(false);
const confetti = ref(false);

const welchLines = [
  'NO REAL FRUIT',
  'NO GUSHERS',
  "NO MOTT'S FRUIT SNACKS",
  'LOOK INTO MY EYES —',
  "ONLY WELCH'S.",
  'ONLY ORIGINAL.',
];

const timers: number[] = [];
function later(fn: () => void, ms: number) {
  timers.push(window.setTimeout(fn, ms));
}

function burstConfetti() {
  confetti.value = false;
  // re-trigger on next frame so repeated taps replay it
  requestAnimationFrame(() => {
    confetti.value = true;
    later(() => (confetti.value = false), 2800);
  });
}

function doWelchs() {
  welchOn.value = true;
  burstConfetti();
  store.findEasterEgg('welchs');
  // closes on click (overlay has @click) — no auto-dismiss so it's readable
}

function doMods() {
  modsOn.value = true;
  store.findEasterEgg('mods');
  later(() => (modsOn.value = false), 2000);
}

function doEdit() {
  editOn.value = true;
  store.findEasterEgg('edit');
  later(() => (editOn.value = false), 1600);
}

const CONFETTI_COLORS = ['#FF5FA2', '#9B4DFF', '#7CE38B', '#FFD24A', '#FFF0FB'];
function confettiStyle(n: number) {
  const left = (n * 97) % 100;
  const delay = ((n * 53) % 100) / 100;
  const dur = 1.7 + (((n * 31) % 100) / 100) * 1.5;
  const color = CONFETTI_COLORS[n % CONFETTI_COLORS.length];
  const size = 6 + (n % 6);
  return {
    left: left + '%',
    background: color,
    width: size + 'px',
    height: size + 'px',
    animationDelay: delay + 's',
    animationDuration: dur + 's',
  };
}

function onKey(e: KeyboardEvent) {
  if (!isSnackers.value) return;
  const el = e.target as HTMLElement | null;
  if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
  const k = e.key.toLowerCase();
  if (k === 'm') doMods();
  else if (k === 'c') doEdit();
  else if (k === 'w') doWelchs();
}

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
  timers.forEach(clearTimeout);
});
</script>

<style scoped>
.snk-root { position: relative; z-index: 1200; }

/* ── pinned mascot CTA ── */
.snk-cta {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  border: 3px solid #FFF0FB;
  border-radius: 999px;
  background: linear-gradient(135deg, #FF5FA2, #9B4DFF);
  color: #FFF0FB;
  cursor: pointer;
  box-shadow: 0 6px 0 #7A2A8E, 0 0 34px rgba(255, 95, 162, 0.5);
  animation: snkFloat 2.6s ease-in-out infinite;
  transition: transform 0.15s ease;
}
.snk-cta.hidden { opacity: 0; pointer-events: none; }
.snk-cta:hover { transform: translateY(-3px) rotate(-2deg); }
.snk-cta:active { transform: translateY(3px); box-shadow: 0 2px 0 #7A2A8E; }
.snk-cta-face {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #2E1656;
  border: 2px solid #FFD24A;
  overflow: hidden;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}
.snk-filian {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 3px solid #fff;
}
.snk-cta-txt { display: flex; flex-direction: column; line-height: 1.05; text-align: left; }
.snk-cta-txt b { font-family: 'Baloo 2', system-ui, sans-serif; font-weight: 800; font-size: 0.9rem; }
.snk-cta-txt small { font-family: 'Quicksand', system-ui, sans-serif; font-size: 0.62rem; opacity: 0.85; }
@keyframes snkFloat {
  0%, 100% { transform: translateY(0) rotate(-1.5deg); }
  50% { transform: translateY(-6px) rotate(1.5deg); }
}

/* ── Welch's overlay ── */
.snk-welch {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(27, 11, 46, 0.85);
  backdrop-filter: blur(4px);
  cursor: pointer;
}
.snk-welch-card { text-align: center; padding: 2rem 3rem; }
.snk-welch-mascot {
  display: inline-block;
  width: 92px;
  height: 92px;
  margin-bottom: 1rem;
  animation: snkBob 1.4s ease-in-out infinite;
}
@keyframes snkBob { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-8px) rotate(4deg); } }
.snk-line {
  font-family: 'Baloo 2', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(1.5rem, 4.6vw, 3rem);
  color: #FFF0FB;
  text-shadow: 3px 3px 0 #9B4DFF, 6px 6px 0 rgba(123, 45, 191, 0.35);
  opacity: 0;
  transform: scale(0.4);
  animation: snkPop 0.42s cubic-bezier(0.2, 1.7, 0.4, 1) forwards;
}
.snk-line:nth-child(6) { color: #FFD24A; }
@keyframes snkPop {
  0% { opacity: 0; transform: scale(0.4) rotate(-6deg); }
  70% { transform: scale(1.14) rotate(2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}
.snk-close {
  display: block;
  margin-top: 1.5rem;
  font-family: 'Quicksand', system-ui, sans-serif;
  color: #D9B8F0;
  font-size: 0.9rem;
}

/* ── MODS banner ── */
.snk-mods {
  position: fixed;
  top: 74px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1300;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.4rem 0.6rem 0.6rem;
  background: #FFD24A;
  color: #3A1560;
  font-family: 'Baloo 2', system-ui, sans-serif;
  font-weight: 800;
  font-size: 1.6rem;
  border-radius: 999px;
  border: 3px solid #3A1560;
  box-shadow: 0 8px 0 rgba(58, 21, 96, 0.4);
  white-space: nowrap;
}
.snk-mods-face {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: #2E1656;
  border: 2px solid #FF5FA2;
  overflow: hidden;
  display: grid; place-items: center;
}

/* ── clip frame ── */
.snk-edit {
  position: fixed;
  inset: 0;
  z-index: 1300;
  pointer-events: none;
  border: 8px solid #FF3B3B;
  box-shadow: inset 0 0 60px rgba(255, 59, 59, 0.3);
}
.snk-rec {
  position: absolute;
  top: 84px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Baloo 2', system-ui, sans-serif;
  font-weight: 800;
  font-size: 1.4rem;
  color: #FFF;
  background: #FF3B3B;
  padding: 0.3rem 0.85rem;
  border-radius: 8px;
}
.snk-rec-dot {
  width: 12px; height: 12px; border-radius: 50%;
  background: #FFF;
  animation: snkRec 0.7s steps(2) infinite;
}
@keyframes snkRec { 50% { opacity: 0.35; } }

/* ── confetti ── */
.snk-confetti { position: fixed; inset: 0; z-index: 1250; pointer-events: none; overflow: hidden; }
.snk-confetti i {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  animation-name: snkFall;
  animation-timing-function: linear;
  animation-iteration-count: 1;
}
@keyframes snkFall {
  0% { transform: translateY(-20px) rotate(0); opacity: 1; }
  100% { transform: translateY(102vh) rotate(720deg); opacity: 0.9; }
}

/* ── hint ── */
.snk-hint {
  position: fixed;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  z-index: 1190;
  font-family: 'Quicksand', system-ui, sans-serif;
  font-size: 0.72rem;
  color: #D9B8F0;
  background: rgba(46, 22, 86, 0.72);
  border: 1px solid rgba(255, 95, 162, 0.3);
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  white-space: nowrap;
}
.snk-hint b { color: #FFD24A; }

/* transitions */
.snk-fade-enter-active, .snk-fade-leave-active { transition: opacity 0.25s ease; }
.snk-fade-enter-from, .snk-fade-leave-to { opacity: 0; }
.snk-drop-enter-active { transition: transform 0.3s cubic-bezier(0.2, 1.6, 0.4, 1); }
.snk-drop-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.snk-drop-enter-from { transform: translate(-50%, -140%); }
.snk-drop-leave-to { transform: translate(-50%, -60%); opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .snk-cta, .snk-welch-mascot { animation: none; }
}
@media (max-width: 640px) {
  .snk-cta-txt { display: none; }
  .snk-cta { padding: 0.4rem; }
  .snk-hint { display: none; }
}
</style>
