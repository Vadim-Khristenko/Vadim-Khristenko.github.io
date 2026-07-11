<template>
  <Teleport to="body">
    <div v-if="isMac" class="mc">
      <!-- pinned classic-Mac launcher -->
      <div class="mc-launcher">
        <button class="mc-mac-btn" title="Special" @click="menuOpen = !menuOpen">
          <svg class="mc-mac" viewBox="0 0 48 56" aria-hidden="true">
            <rect x="3" y="2" width="42" height="52" fill="var(--paper)" stroke="currentColor" stroke-width="2" />
            <rect x="9" y="7" width="30" height="23" fill="none" stroke="currentColor" stroke-width="2" />
            <rect x="16" y="13" width="3" height="4" fill="currentColor" />
            <rect x="29" y="13" width="3" height="4" fill="currentColor" />
            <path d="M16 21 Q24 27 32 21" fill="none" stroke="currentColor" stroke-width="2" />
            <rect x="12" y="37" width="24" height="3" fill="currentColor" />
            <rect x="12" y="44" width="16" height="2" fill="currentColor" />
          </svg>
        </button>
        <Transition name="mc-pop">
          <ul v-if="menuOpen" class="mc-menu" @click="menuOpen = false">
            <li @click="aboutOpen = true">About This Macintosh…</li>
            <li class="mc-sep"></li>
            <li @click="doBomb">Restart</li>
            <li @click="doShutdown">Shut Down…</li>
          </ul>
        </Transition>
      </div>

      <!-- System Error (bomb) -->
      <Transition name="mc-fade">
        <div v-if="bombOpen" class="mc-scrim" @click.self="bombOpen = false">
          <div class="mc-dialog mc-bomb">
            <div class="mc-dialog-body">
              <svg class="mc-icon" viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="21" cy="30" r="14" fill="currentColor" />
                <path d="M30 18 Q37 9 41 12" fill="none" stroke="currentColor" stroke-width="3" />
                <g stroke="currentColor" stroke-width="2">
                  <line x1="41" y1="4" x2="41" y2="11" /><line x1="37" y1="7" x2="45" y2="7" />
                  <line x1="38" y1="4" x2="44" y2="11" /><line x1="44" y1="4" x2="38" y2="11" />
                </g>
                <circle cx="16" cy="25" r="3" fill="var(--paper)" />
              </svg>
              <div class="mc-dialog-text">
                <p>Sorry, a system error occurred.</p>
                <p class="mc-small">“VAI_PROG”</p>
                <p class="mc-small">ID = 01 · NYA_CATGIRL</p>
              </div>
            </div>
            <div class="mc-dialog-actions">
              <button class="mc-btn" @click="bombOpen = false">Resume</button>
              <button class="mc-btn mc-default" @click="restart">Restart</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- About This Macintosh -->
      <Transition name="mc-fade">
        <div v-if="aboutOpen" class="mc-scrim" @click.self="aboutOpen = false">
          <div class="mc-dialog mc-about">
            <div class="mc-about-head">
              <svg class="mc-happy" viewBox="0 0 48 56" aria-hidden="true">
                <rect x="3" y="2" width="42" height="52" fill="var(--paper)" stroke="currentColor" stroke-width="2" />
                <rect x="9" y="7" width="30" height="23" fill="none" stroke="currentColor" stroke-width="2" />
                <rect x="16" y="13" width="3" height="4" fill="currentColor" />
                <rect x="29" y="13" width="3" height="4" fill="currentColor" />
                <path d="M16 21 Q24 27 32 21" fill="none" stroke="currentColor" stroke-width="2" />
                <rect x="12" y="37" width="24" height="3" fill="currentColor" />
              </svg>
              <div>
                <h3>Macintosh VAI</h3>
                <p class="mc-small">System 7.0.1 · Finder</p>
              </div>
            </div>
            <dl class="mc-specs">
              <div><dt>Total Memory</dt><dd>∞ K</dd></div>
              <div><dt>Largest Unused Block</dt><dd>good vibes</dd></div>
              <div><dt>Built-in Memory</dt><dd>39 repos</dd></div>
            </dl>
            <p class="mc-small mc-copy">© 1984–2026 VAI_PROG. Power of Pixel Art.</p>
            <div class="mc-dialog-actions"><button class="mc-btn mc-default" @click="aboutOpen = false">OK</button></div>
          </div>
        </div>
      </Transition>

      <!-- Shut Down → Happy Mac -->
      <Transition name="mc-fade">
        <div v-if="shutOpen" class="mc-shut" @click="shutOpen = false">
          <svg class="mc-happy-big" viewBox="0 0 48 56" aria-hidden="true">
            <rect x="3" y="2" width="42" height="52" fill="none" stroke="currentColor" stroke-width="2" />
            <rect x="9" y="7" width="30" height="23" fill="none" stroke="currentColor" stroke-width="2" />
            <rect x="16" y="13" width="3" height="4" fill="currentColor" />
            <rect x="29" y="13" width="3" height="4" fill="currentColor" />
            <path d="M16 21 Q24 27 32 21" fill="none" stroke="currentColor" stroke-width="2" />
            <rect x="12" y="37" width="24" height="3" fill="currentColor" />
          </svg>
          <p>It’s now safe to turn off your Macintosh.</p>
          <p class="mc-small">(click to wake it up)</p>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';

const store = usePreferencesStore();
const isMac = computed(() => store.theme === 'macclassic');

const menuOpen = ref(false);
const bombOpen = ref(false);
const aboutOpen = ref(false);
const shutOpen = ref(false);

function doBomb() { menuOpen.value = false; bombOpen.value = true; store.findEasterEgg('bomb'); }
function doShutdown() { menuOpen.value = false; shutOpen.value = true; store.findEasterEgg('shutdown'); }
function restart() { bombOpen.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }); }

function onKey(e: KeyboardEvent) {
  if (!isMac.value) return;
  const el = e.target as HTMLElement | null;
  if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
  if (e.key.toLowerCase() === 'b') doBomb();
  else if (e.key === 'Escape') { menuOpen.value = bombOpen.value = aboutOpen.value = shutOpen.value = false; }
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<style scoped>
.mc {
  font-family: 'ChicagoFLF', 'Chicago', 'Geneva9', system-ui, sans-serif;
  color: var(--ink, #000);
}

/* ── launcher ── */
.mc-launcher { position: fixed; right: 18px; bottom: 18px; z-index: 1200; }
.mc-mac-btn {
  width: 52px; height: 58px;
  padding: 4px;
  background: var(--paper, #fff);
  border: 1px solid var(--ink, #000);
  box-shadow: 2px 2px 0 var(--ink, #000);
  color: var(--ink, #000);
  cursor: pointer;
}
.mc-mac-btn:active { background: var(--ink, #000); color: var(--paper, #fff); }
.mc-mac { width: 100%; height: 100%; display: block; }
.mc-menu {
  position: absolute; right: 0; bottom: calc(100% + 6px);
  min-width: 190px; list-style: none;
  background: var(--paper, #fff);
  border: 1px solid var(--ink, #000);
  box-shadow: 2px 2px 0 var(--ink, #000);
  padding: 2px;
}
.mc-menu li { padding: 4px 12px; font-size: 0.9rem; cursor: pointer; }
.mc-menu li:not(.mc-sep):hover { background: var(--ink, #000); color: var(--paper, #fff); }
.mc-menu li.mc-sep { height: 0; padding: 0; border-top: 1px solid var(--ink, #000); margin: 3px 0; cursor: default; }

/* ── dialogs ── */
.mc-scrim {
  position: fixed; inset: 0; z-index: 1350;
  display: grid; place-items: center;
  background: rgba(0,0,0,0.15);
}
.mc-dialog {
  background: var(--paper, #fff);
  border: 2px solid var(--ink, #000);
  box-shadow: 3px 3px 0 var(--ink, #000);
  padding: 16px 18px;
  width: min(360px, 92vw);
  color: var(--ink, #000);
}
.mc-dialog-body { display: flex; gap: 14px; align-items: flex-start; }
.mc-icon, .mc-happy { width: 44px; height: 44px; flex-shrink: 0; color: var(--ink, #000); }
.mc-happy { width: 40px; height: 46px; }
.mc-dialog-text p { font-size: 0.95rem; margin-bottom: 4px; line-height: 1.3; }
.mc-small { color: var(--text-dim, #666); font-size: 0.8rem; }
.mc-dialog-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
.mc-btn {
  min-width: 68px; padding: 4px 14px;
  background: var(--paper, #fff); color: var(--ink, #000);
  border: 1px solid var(--ink, #000); border-radius: 9px;
  font-family: inherit; font-size: 0.9rem; cursor: pointer;
}
.mc-btn:active { background: var(--ink, #000); color: var(--paper, #fff); }
.mc-default { box-shadow: 0 0 0 2px var(--paper, #fff), 0 0 0 3px var(--ink, #000); }

.mc-about-head { display: flex; gap: 14px; align-items: center; margin-bottom: 12px; }
.mc-about-head h3 { font-size: 1.2rem; font-weight: 400; }
.mc-specs { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; border-top: 1px solid var(--ink, #000); padding-top: 10px; }
.mc-specs div { display: flex; justify-content: space-between; gap: 12px; font-size: 0.85rem; }
.mc-specs dt { color: var(--text-dim, #666); }
.mc-copy { text-align: center; margin-bottom: 12px; }

/* ── shut down screen ── */
.mc-shut {
  position: fixed; inset: 0; z-index: 1400;
  background: var(--paper, #fff);
  color: var(--ink, #000);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;
  cursor: pointer; text-align: center;
}
.mc-happy-big { width: 90px; height: 105px; color: var(--ink, #000); }
.mc-shut p { font-size: 1.1rem; }

/* transitions */
.mc-fade-enter-active, .mc-fade-leave-active { transition: opacity 0.15s ease; }
.mc-fade-enter-from, .mc-fade-leave-to { opacity: 0; }
.mc-pop-enter-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.mc-pop-enter-from { opacity: 0; transform: translateY(6px); }
</style>
