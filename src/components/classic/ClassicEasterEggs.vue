<template>
  <Teleport to="body">
    <div v-if="isClassic">
      <!-- confetti -->
      <div v-if="party" class="cl-confetti" aria-hidden="true">
        <i v-for="n in 60" :key="n" :style="pieceStyle(n)"></i>
      </div>
      <!-- toast -->
      <Transition name="cl-toast">
        <div v-if="toast" class="cl-toast" @click="toast = false">
          <span class="cl-toast-bar"></span>
          <div>
            <b>You found the Konami code!</b>
            <small>Welcome back to 2017. ✦ (↑↑↓↓←→←→ B A)</small>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';

const store = usePreferencesStore();
const isClassic = computed(() => store.theme === 'classic');

const party = ref(false);
const toast = ref(false);
const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let buf: string[] = [];
const timers: number[] = [];

function fire() {
  party.value = false;
  requestAnimationFrame(() => { party.value = true; });
  toast.value = true;
  store.findEasterEgg('konami');
  timers.push(window.setTimeout(() => (party.value = false), 3200));
  timers.push(window.setTimeout(() => (toast.value = false), 4200));
}

function onKey(e: KeyboardEvent) {
  if (!isClassic.value) return;
  const el = e.target as HTMLElement | null;
  if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
  buf.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
  if (buf.length > SEQ.length) buf.shift();
  if (buf.length === SEQ.length && SEQ.every((k, i) => k === buf[i])) { buf = []; fire(); }
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#22D3EE', '#F59E0B'];
function pieceStyle(n: number) {
  const left = (n * 89) % 100;
  const delay = ((n * 37) % 100) / 100;
  const dur = 2 + (((n * 53) % 100) / 100) * 1.6;
  const size = 6 + (n % 6);
  return {
    left: left + '%',
    background: COLORS[n % COLORS.length],
    width: size + 'px',
    height: size * 0.5 + 'px',
    animationDelay: delay + 's',
    animationDuration: dur + 's',
  };
}

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
  timers.forEach(clearTimeout);
});
</script>

<style scoped>
.cl-confetti { position: fixed; inset: 0; z-index: 1250; pointer-events: none; overflow: hidden; }
.cl-confetti i {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  animation-name: clFall;
  animation-timing-function: ease-in;
  animation-iteration-count: 1;
}
@keyframes clFall {
  0% { transform: translateY(-20px) rotate(0); opacity: 1; }
  100% { transform: translateY(102vh) rotate(680deg); opacity: 0.85; }
}

.cl-toast {
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  z-index: 1300;
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 92vw;
  padding: 14px 20px 14px 16px;
  background: var(--bg-card, #fff);
  color: var(--text, #111827);
  border: 1px solid var(--border, rgba(0,0,0,0.08));
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.18);
  font-family: 'Poppins', system-ui, sans-serif;
  cursor: pointer;
}
.cl-toast-bar { width: 5px; align-self: stretch; border-radius: 4px; background: linear-gradient(#6366F1, #8B5CF6); }
.cl-toast b { display: block; font-weight: 600; font-size: 0.95rem; }
.cl-toast small { color: var(--text-muted, #6B7280); font-size: 0.8rem; }

.cl-toast-enter-active { transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.2, 1.4, 0.4, 1); }
.cl-toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.cl-toast-enter-from, .cl-toast-leave-to { opacity: 0; transform: translate(-50%, 16px); }
</style>
