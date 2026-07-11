<template>
  <section id="hero" class="hero">
    <div class="hero-bg">
      <div class="glow-1"></div>
      <div class="glow-2"></div>
      <div class="grid-lines"></div>
    </div>

    <div class="hero-inner">
      <div class="hero-left">
        <div
          v-if="isModern"
          class="hero-masthead"
          role="button"
          tabindex="0"
          :title="newspaper ? 'Back to the site' : 'Read the front page'"
          @click="toggleNewspaper"
          @keydown.enter="toggleNewspaper"
        >
          <span class="mh-issue">Nº 03 — MMXXVI</span>
          <span class="mh-rec"><i class="rec-dot"></i> LIVE · {{ clock }}</span>
        </div>
        <p class="hero-aka">{{ t('hero.aka') }}</p>
        <h1 class="hero-title">
          <span class="gtext">{{ t('hero.name') }}</span>
        </h1>
        <p class="hero-sub">{{ t('hero.title') }}</p>
        <p class="hero-note">{{ t('hero.subtitle') }}</p>
        <p class="hero-born">{{ t('hero.born') }} <span class="age">{{ age }}</span>.</p>

        <div class="hero-acts">
          <a href="#projects" class="hbtn hbtn-primary">{{ t('hero.projects') }}</a>
          <a href="#contact" class="hbtn hbtn-ghost">{{ t('hero.contact') }}</a>
        </div>

        <!-- GitHub stats -->
        <div v-if="ghStats" class="gh-stats">
          <div class="gh-stat">
            <span class="gh-num">{{ ghStats.repos }}</span>
            <span class="gh-lbl">{{ t('hero.stats.repos') }}</span>
          </div>
          <div class="gh-stat">
            <span class="gh-num">{{ fmt(ghStats.stars) }}</span>
            <span class="gh-lbl">{{ t('hero.stats.stars') }}</span>
          </div>
          <div class="gh-stat">
            <span class="gh-num">{{ fmt(ghStats.forks) }}</span>
            <span class="gh-lbl">{{ t('hero.stats.forks') }}</span>
          </div>
          <div v-if="ghStats.followers != null" class="gh-stat">
            <span class="gh-num">{{ fmt(ghStats.followers) }}</span>
            <span class="gh-lbl">{{ t('hero.stats.followers') }}</span>
          </div>
        </div>
        <p v-if="statsDate" class="gh-updated">↻ {{ t('hero.stats.updated') }} {{ fmtDate(statsDate) }}</p>
      </div>

      <div class="hero-right">
        <div class="avatar-wrap">
          <div class="avatar-ring"></div>
          <img src="/avatars/VAI_PROG.png" alt="VAI-PROG" class="avatar-img" />
        </div>
        <figcaption v-if="isModern" class="avatar-cap">Fig. 1 — the author, aged {{ age }}, at work.</figcaption>
      </div>
    </div>

    <!-- Kinetic role marquee -->
    <div class="hero-marquee" aria-hidden="true">
      <div class="marquee-track">
        <span v-for="run in 2" :key="run" class="marquee-run">
          <span v-for="r in roles" :key="run + r" class="marquee-item">
            {{ r }}<i class="marquee-dot">●</i>
          </span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from '@/composables/useI18n';
import { useStats } from '@/composables/useStats';
import { usePreferencesStore } from '@/stores/preferences';

const { t } = useI18n();
const store = usePreferencesStore();

const isModern = computed(() => store.theme === 'modern');

// Kinetic marquee roles
const roles = [
  'Developer', 'Bot-maker', 'Open-source', 'Rust', 'Vue', 'TypeScript',
  'VTuber fan', 'Storyteller', 'Quiet software',
];

const { stats } = useStats();
const ghStats = computed(() => stats.value?.user ?? { repos: 37, stars: 280, forks: 25, followers: 42 });
const statsDate = computed(() => (stats.value?.generatedAt ? new Date(stats.value.generatedAt) : null));
function fmtDate(d: Date | null): string {
  if (!d || isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

const age = computed(() => {
  const b = new Date('2010-09-18');
  const n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
  return a;
});

function fmt(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

/* ── Modern masthead: live clock + newspaper-flip easter egg ── */
const clock = ref('--:--');
const newspaper = ref(false);
let clockTimer: ReturnType<typeof setInterval> | undefined;

function tick() {
  const n = new Date();
  clock.value = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
}

function toggleNewspaper() {
  newspaper.value = !newspaper.value;
  document.documentElement.classList.toggle('newspaper', newspaper.value);
  if (newspaper.value) store.findEasterEgg('newspaper');
}

onMounted(() => {
  tick();
  clockTimer = setInterval(tick, 15000);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
  document.documentElement.classList.remove('newspaper');
});

</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 100px 1.5rem 32px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.glow-1 {
  position: absolute;
  width: 600px;
  height: 600px;
  background: var(--primary);
  border-radius: 50%;
  filter: blur(180px);
  opacity: 0.1;
  top: -200px;
  right: -150px;
  animation: hglow 12s ease-in-out infinite;
}

.glow-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  background: var(--accent);
  border-radius: 50%;
  filter: blur(150px);
  opacity: 0.08;
  bottom: -100px;
  left: -100px;
  animation: hglow 10s ease-in-out infinite reverse;
}

@keyframes hglow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.15); }
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
  background-size: 80px 80px;
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4rem;
  align-items: center;
}

/* Left */
.hero-left { max-width: 640px; }

.hero-aka {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: 1rem;
  line-height: 1.7;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 1.25rem;
}

.gtext {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.hero-born {
  font-size: var(--font-size-base);
  color: var(--text);
  margin-bottom: 1.75rem;
}

.age { font-weight: 700; color: var(--text); }

.hero-note {
  font-size: var(--font-size-sm);
  color: var(--text-dim);
  margin-bottom: 1.5rem;
  max-width: 46ch;
  line-height: 1.55;
}

/* ===== Kinetic role marquee ===== */
.hero-marquee {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-top: var(--space-10);
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 0.7rem 0;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.marquee-track {
  display: inline-flex;
  white-space: nowrap;
  animation: heroMarquee 34s linear infinite;
}
.hero-marquee:hover .marquee-track { animation-play-state: paused; }
.marquee-run { display: inline-flex; }
.marquee-item {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.8vw, 2.1rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--text);
  padding: 0 0.2rem;
}
.marquee-dot {
  color: var(--primary);
  font-style: normal;
  margin: 0 1.1rem;
  font-size: 0.7em;
}
@keyframes heroMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Actions */
.hero-acts {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.hbtn {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.hbtn-primary {
  background: var(--gradient-hero);
  color: white;
  border: none;
  box-shadow: var(--shadow-md);
}

.hbtn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glow-primary);
}

.hbtn-ghost {
  background: var(--bg-card);
  color: var(--text);
  border: 1px solid var(--border);
}

.hbtn-ghost:hover {
  border-color: var(--border-hover);
  background: var(--bg-elevated);
}

/* GitHub stats */
.gh-stats {
  display: flex;
  gap: 2rem;
}

.gh-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gh-num {
  font-family: var(--font-mono);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text);
}

.gh-lbl {
  font-size: var(--font-size-xs);
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.gh-updated {
  margin-top: 0.85rem;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-dim);
  opacity: 0.75;
}

/* Right - Avatar */
.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-wrap {
  position: relative;
  width: 280px;
  height: 280px;
}

.avatar-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: var(--gradient-hero);
  opacity: 0.3;
  filter: blur(20px);
  animation: apulse 4s ease-in-out infinite;
}

@keyframes apulse {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.05); }
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border);
  position: relative;
  z-index: 1;
}

/* Responsive */
@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-right { order: -1; }
  
  .avatar-wrap {
    width: 180px;
    height: 180px;
  }
  
  .hero-acts {
    justify-content: center;
  }
  
  .gh-stats {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero { padding: 90px 1rem 40px; }
  .avatar-wrap { width: 140px; height: 140px; }
  .gh-stats { gap: 1.5rem; }
}

/* ===== THEME OVERRIDES ===== */
[data-theme="win95"] .hbtn-primary {
  background: #C0C0C0;
  color: #000;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  border-radius: 0;
  box-shadow: none;
}

[data-theme="win95"] .hbtn-ghost {
  background: #C0C0C0;
  color: #000;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  border-radius: 0;
}

[data-theme="win95"] .avatar-img {
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  border-radius: 0;
}

[data-theme="macclassic"] .hbtn-primary {
  background: #000;
  color: #FFF;
  border: 2px solid #000;
  border-radius: 0;
  box-shadow: 3px 3px 0 #000;
}

[data-theme="macclassic"] .avatar-img {
  border: 2px solid #000;
  border-radius: 0;
  filter: grayscale(1);
}

[data-theme="classic"] .hbtn-primary {
  background: var(--gradient-hero);
  color: #FFF;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(79,70,229,0.25);
}

[data-theme="classic"] .hbtn-ghost {
  background: #FFFFFF;
  color: var(--text);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: var(--radius-md);
}

[data-theme="classic"] .hbtn-ghost:hover {
  border-color: rgba(79,70,229,0.3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

[data-theme="classic"] .gtext {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme="terminal"] .hbtn-primary {
  background: #39C5BB;
  color: #1A1B26;
  border: 1px solid #39C5BB;
  border-radius: 0;
  box-shadow: 0 0 12px rgba(57,197,187,0.25);
  font-family: var(--font-mono);
}

[data-theme="terminal"] .hbtn-primary::before {
  content: './';
  opacity: 0.7;
}

[data-theme="terminal"] .hbtn-ghost {
  background: #24283B;
  color: #39C5BB;
  border: 1px solid rgba(57,197,187,0.3);
  border-radius: 0;
  font-family: var(--font-mono);
}

[data-theme="terminal"] .gtext {
  background: none;
  -webkit-text-fill-color: #39C5BB;
  color: #39C5BB;
}

[data-theme="terminal"] .gh-num { color: #39C5BB; }

[data-theme="terminal"] .avatar-img {
  border: 1px solid #39C5BB;
  border-radius: 0;
  filter: drop-shadow(0 0 8px rgba(57,197,187,0.3));
}

[data-theme="terminal"] .grid-lines {
  background-image:
    linear-gradient(rgba(57,197,187,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(57,197,187,0.04) 1px, transparent 1px);
}
</style>