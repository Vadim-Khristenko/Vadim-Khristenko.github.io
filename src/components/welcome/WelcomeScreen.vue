<template>
  <Transition name="fade" mode="out-in">
    <!-- STEP 1: INTRO -->
    <div v-if="step === 'intro'" key="intro" :class="['step-intro', `theme-${store.theme}`]">
      <div class="intro-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="grid-overlay"></div>
      </div>
      
      <button class="welcome-skip" @click="skipAll">{{ t('welcome.skip') }} ✕</button>

      <div class="intro-content">
        <!-- Logo mark -->
        <div class="logo-mark" @click="handleLogoClick" :title="mikuHint">
          <BrandMark :size="56" />
          <span v-if="mikuUnlocked" class="miku-spark">♪</span>
        </div>

        <h1 class="intro-heading">
          {{ greeting }}
        </h1>

        <p class="intro-sub">
          {{ t('welcome.intro') }} <span class="brand">VAI_PROG</span>
        </p>

        <p class="intro-facts">{{ facts }}</p>

        <!-- Name input -->
        <div class="name-box">
          <label class="name-label">{{ t('welcome.namePrompt') }}</label>
          <input
            ref="nameInput"
            v-model="userName"
            type="text"
            :placeholder="t('welcome.namePlaceholder')"
            class="name-field"
            @keyup.enter="goToThemes"
          />
        </div>
        
        <div class="intro-actions">
          <button class="btn-primary" @click="goToThemes">
            {{ userName.trim() ? t('welcome.continue') : t('welcome.skip') }}
          </button>
        </div>
        
        <p class="locale-hint">{{ t('welcome.youCanChange') }}</p>
      </div>
    </div>

    <!-- STEP 2: THEME SELECTOR -->
    <div v-else-if="step === 'themes'" key="themes" :class="['step-themes', `theme-${store.theme}`]">
      <div class="themes-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
      </div>
      
      <div class="themes-content">
        <header class="themes-header">
          <h2>{{ t('welcome.themeTitle') }}</h2>
          <p>{{ t('welcome.themeSubtitle') }}</p>
        </header>
        
        <div class="theme-list">
          <button
            v-for="theme in themes"
            :key="theme.id"
            :class="['theme-item', { active: selected === theme.id }]"
            :style="themeStyle(theme)"
            @click="selected = theme.id"
          >
            <!-- Preview window -->
            <div class="theme-preview" :class="`preview-${theme.id}`">
              <div class="pw-titlebar">
                <span></span><span></span><span></span>
              </div>
              <div class="pw-body">
                <div class="pw-line"></div>
                <div class="pw-line short"></div>
                <div class="pw-btn"></div>
              </div>
            </div>
            
            <!-- Info -->
            <div class="theme-meta">
              <div class="theme-meta-top">
                <h3>{{ themeName(theme) }}</h3>
                <span v-if="isRec(theme)" class="rec-badge">{{ t('welcome.recommended') }}</span>
              </div>
              <p class="theme-desc">{{ themeDesc(theme) }}</p>
              <span class="theme-audience">{{ themeAudience(theme) }}</span>
            </div>
            
            <!-- Check -->
            <div v-if="selected === theme.id" class="theme-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </button>
        </div>
        
        <div class="themes-footer">
          <button class="btn-back" @click="step = 'intro'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {{ t('common.back') }}
          </button>
          <button class="btn-primary" :disabled="!selected" @click="finish">
            {{ t('welcome.start') }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';
import { useI18n } from '@/composables/useI18n';
import { themes } from '@/i18n/themes';
import type { ThemeMode } from '@/types/theme';
import BrandMark from '../ui/BrandMark.vue';

const store = usePreferencesStore();
const { t, locale } = useI18n();

const emit = defineEmits<{ done: [] }>();

const step = ref<'intro' | 'themes'>('intro');
const userName = ref(store.userName || '');
const selected = ref<ThemeMode>(store.theme);
const nameInput = ref<HTMLInputElement>();
const logoClicks = ref(0);

// Time-aware greeting — a small "this was written for you, right now" touch.
const greeting = (() => {
  const h = new Date().getHours();
  const part = h < 5 ? 'night' : h < 12 ? 'morning' : h < 18 ? 'day' : 'evening';
  const m: Record<string, Record<string, string>> = {
    ru: { night: 'Доброй ночи!', morning: 'Доброе утро!', day: 'Добрый день!', evening: 'Добрый вечер!' },
    en: { night: 'Good night!', morning: 'Good morning!', day: 'Hey there!', evening: 'Good evening!' },
    zh: { night: '夜深了！', morning: '早上好！', day: '你好！', evening: '晚上好！' },
  };
  return (m[locale.value] || m.en)[part];
})();

const facts = locale.value === 'ru'
  ? '8 тем · 3 Rust-лаборатории · три языка'
  : locale.value === 'zh'
    ? '8 套主题 · 3 个 Rust 实验 · 三种语言'
    : '8 themes · 3 Rust labs · trilingual';

const mikuHint = locale.value === 'ru'
  ? 'нажми три раза…'
  : locale.value === 'zh'
    ? '点三下…'
    : 'tap three times…';

const mikuUnlocked = computed(() => store.isMikuUnlocked);

onMounted(() => {
  nextTick(() => nameInput.value?.focus());
});

function handleLogoClick() {
  logoClicks.value++;
  if (logoClicks.value >= 3 && !store.isMikuUnlocked) {
    store.findEasterEgg('miku');
    logoClicks.value = 0;
  }
}

function goToThemes() {
  if (userName.value.trim()) store.setName(userName.value.trim());
  step.value = 'themes';
}

function isRec(theme: typeof themes[0]) {
  return theme.id === 'modern' || theme.id === 'snackers';
}

function themeName(t: typeof themes[0]) {
  const m: Record<string, string> = { ru: t.nameRu, en: t.nameEn, zh: t.nameZh };
  return m[locale.value] || t.nameEn;
}

function themeDesc(t: typeof themes[0]) {
  const m: Record<string, string> = { ru: t.descriptionRu, en: t.descriptionEn, zh: t.descriptionZh };
  return m[locale.value] || t.descriptionEn;
}

function themeAudience(t: typeof themes[0]) {
  const m: Record<string, string> = { ru: t.audienceRu, en: t.audienceEn, zh: t.audienceZh };
  return m[locale.value] || t.audienceEn;
}

function themeStyle(t: typeof themes[0]) {
  return { '--t-color': t.color } as Record<string, string>;
}

function finish() {
  if (userName.value.trim()) store.setName(userName.value.trim());
  if (selected.value) store.setTheme(selected.value);
  store.markVisited();
  emit('done');
}

// Bail out at any point — still counts as "visited" so it won't nag again.
function skipAll() {
  if (userName.value.trim()) store.setName(userName.value.trim());
  store.markVisited();
  emit('done');
}
</script>

<style scoped>
/* ===== INTRO STEP ===== */
.step-intro {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}

.intro-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.2;
  animation: floatOrb 10s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--primary);
  top: -200px;
  right: -100px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--accent);
  bottom: -100px;
  left: -100px;
  animation-delay: -4s;
}

@keyframes floatOrb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 60px 60px;
}

.intro-content {
  position: relative;
  z-index: 1;
  max-width: 420px;
  width: 100%;
  text-align: center;
}

.logo-mark {
  width: 56px;
  height: 56px;
  margin: 0 auto 2rem;
  color: var(--primary);
  cursor: pointer;
  transition: transform 0.3s ease;
}

/* staggered entrance for the intro block */
.intro-content > * {
  animation: introUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.intro-content > *:nth-child(1) { animation-delay: 0.05s; }
.intro-content > *:nth-child(2) { animation-delay: 0.12s; }
.intro-content > *:nth-child(3) { animation-delay: 0.19s; }
.intro-content > *:nth-child(4) { animation-delay: 0.26s; }
.intro-content > *:nth-child(5) { animation-delay: 0.33s; }
.intro-content > *:nth-child(6) { animation-delay: 0.40s; }
@keyframes introUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .intro-content > * { animation: none; }
}

.logo-mark:hover {
  transform: scale(1.1) rotate(5deg);
}

.logo-mark svg {
  width: 100%;
  height: 100%;
}

.intro-heading {
  font-family: var(--font-display);
  font-size: var(--font-size-4xl);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.intro-sub {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.brand {
  color: var(--text);
  font-weight: 600;
}

.intro-facts {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.04em;
  color: var(--text-dim);
  text-transform: uppercase;
  margin-bottom: 2.25rem;
}

/* skip-to-site affordance */
.welcome-skip {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 3;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  padding: 0.35rem 0.85rem;
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.welcome-skip:hover {
  color: var(--text);
  border-color: var(--border-hover);
  background: var(--bg-card);
}

/* miku spark that appears once the egg is unlocked */
.logo-mark { position: relative; }
.miku-spark {
  position: absolute;
  top: -6px;
  right: -10px;
  font-size: 1.1rem;
  color: #39C5BB;
  text-shadow: 0 0 8px rgba(57, 197, 187, 0.6);
  animation: mikuFloat 2.2s ease-in-out infinite;
}
@keyframes mikuFloat {
  0%, 100% { transform: translateY(0) rotate(-8deg); opacity: 0.85; }
  50% { transform: translateY(-5px) rotate(8deg); opacity: 1; }
}

/* Name input */
.name-box {
  margin-bottom: 1.5rem;
}

.name-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.name-field {
  width: 100%;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  outline: none;
  transition: all var(--transition-base);
}

.name-field::placeholder {
  color: var(--text-dim);
}

.name-field:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-muted);
}

/* Actions */
.intro-actions {
  margin-bottom: 1.5rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: var(--gradient-hero);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glow-primary);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.locale-hint {
  font-size: var(--font-size-sm);
  color: var(--text-dim);
}

/* ===== THEMES STEP ===== */
.step-themes {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}

.themes-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.themes-content {
  position: relative;
  z-index: 1;
  max-width: 960px;
  margin: 0 auto;
  padding-top: 2rem;
}

.themes-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.themes-header h2 {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.themes-header p {
  color: var(--text-muted);
  font-size: var(--font-size-base);
}

/* Theme list */
.theme-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.theme-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.theme-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 0%, var(--t-color, transparent) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.theme-item:hover {
  border-color: var(--border-hover);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.theme-item:hover::before {
  opacity: 0.1;
}

.theme-item.active {
  border-color: var(--t-color, var(--primary));
  box-shadow: 0 0 0 1px var(--t-color, var(--primary)), var(--shadow-md);
}

.theme-item.active::before {
  opacity: 0.15;
}

/* Preview */
.theme-preview {
  width: 80px;
  height: 60px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.pw-titlebar {
  height: 16px;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0 6px;
}

.pw-titlebar span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
}

.pw-body {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pw-line {
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  width: 80%;
}

.pw-line.short { width: 50%; }

.pw-btn {
  height: 10px;
  width: 24px;
  background: var(--t-color, var(--primary));
  border-radius: 2px;
  opacity: 0.5;
  margin-top: 2px;
}

/* Preview variants */
  .preview-modern { background: var(--bg-elevated); }
  .preview-win11 { background: #2D2D2D; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); }
  .preview-win11 .pw-titlebar { background: rgba(0,120,212,0.3); height: 14px; }
  .preview-macos26 { background: rgba(30,30,40,0.6); border-radius: 10px; backdrop-filter: blur(10px); }
  .preview-macos26 .pw-titlebar { background: rgba(167,139,250,0.2); border-radius: 10px 10px 0 0; }
  .preview-win95 { background: #C0C0C0; border-radius: 0; border: 2px solid; border-color: #DFDFDF #000 #000 #DFDFDF; }
  .preview-win95 .pw-titlebar { background: #000080; height: 12px; }
  .preview-win95 .pw-titlebar span { background: #FFF; width: 4px; height: 4px; }
  .preview-win95 .pw-line, .preview-win95 .pw-btn { background: #808080; }
  .preview-macclassic { background: #FFF; border-radius: 0; border: 1px solid #000; }
  .preview-macclassic .pw-titlebar { background: #000; height: 10px; }
  .preview-macclassic .pw-titlebar span { display: none; }
  .preview-macclassic .pw-line { background: #000; height: 2px; }
  .preview-macclassic .pw-btn { background: #000; border-radius: 0; }
  .preview-snackers { background: #1A0F2E; border-radius: 12px; border: 1px solid rgba(255,107,157,0.2); }
  .preview-snackers .pw-titlebar { background: rgba(255,107,157,0.2); border-radius: 12px 12px 0 0; }
  .preview-classic { background: #FAFAF9; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
  .preview-classic .pw-titlebar { background: rgba(0,0,0,0.04); height: 10px; }
  .preview-classic .pw-titlebar span { background: rgba(0,0,0,0.15); }
  .preview-classic .pw-line { background: rgba(0,0,0,0.1); height: 3px; }
  .preview-classic .pw-btn { background: #4F46E5; border-radius: 2px; opacity: 0.6; }
  .preview-terminal { background: #24283B; border-radius: 0; border: 1px solid rgba(57,197,187,0.25); font-family: monospace; }
  .preview-terminal .pw-titlebar { display: none; }
  .preview-terminal .pw-body { border-top: 1px solid rgba(57,197,187,0.15); padding-top: 6px; }
  .preview-terminal .pw-line { background: rgba(57,197,187,0.2); height: 2px; }
  .preview-terminal .pw-btn { background: #39C5BB; border-radius: 0; opacity: 0.7; }

  /* Meta */
.theme-meta {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.theme-meta-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.theme-meta h3 {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: 600;
}

.rec-badge {
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  background: var(--gradient-hero);
  color: white;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.theme-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 0.375rem;
}

.theme-audience {
  font-size: var(--font-size-xs);
  color: var(--t-color, var(--primary));
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.theme-check {
  width: 24px;
  height: 24px;
  color: var(--t-color, var(--primary));
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

/* Footer */
.themes-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-back:hover {
  border-color: var(--border-hover);
  color: var(--text);
  background: var(--bg-card);
}

.btn-back svg, .btn-primary svg {
  width: 16px;
  height: 16px;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Responsive */
@media (max-width: 640px) {
  .theme-list {
    grid-template-columns: 1fr;
  }
  
  .intro-heading {
    font-size: var(--font-size-3xl);
  }
  
  .step-intro, .step-themes {
    padding: 1rem;
  }
}

/* ===== THEME-SPECIFIC OVERRIDES ===== */

/* Win95 */
.theme-win95 .btn-primary {
  background: #C0C0C0;
  color: #000;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  border-radius: 0;
  box-shadow: none;
  font-family: var(--font-body);
}

.theme-win95 .btn-primary:active {
  border-color: #000 #DFDFDF #DFDFDF #000;
}

.theme-win95 .name-field {
  border: 2px solid;
  border-color: #808080 #FFF #FFF #808080;
  background: #FFF;
  color: #000;
  border-radius: 0;
}

.theme-win95 .theme-item {
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  border-radius: 0;
  background: #C0C0C0;
}

.theme-win95 .theme-item.active {
  border-color: #000080;
  box-shadow: none;
}

/* Mac Classic */
.theme-macclassic .btn-primary {
  background: #000;
  color: #FFF;
  border-radius: 0;
  box-shadow: 3px 3px 0 #000;
  border: 2px solid #000;
}

.theme-macclassic .name-field {
  border: 2px solid #000;
  background: #FFF;
  color: #000;
  border-radius: 0;
}

.theme-macclassic .theme-item {
  border: 1px solid #000;
  border-radius: 0;
  background: #FFF;
  color: #000;
  box-shadow: 2px 2px 0 #000;
}

.theme-macclassic .theme-item.active {
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
}

.theme-macclassic .theme-desc,
.theme-macclassic .themes-header p {
  color: #333;
}

/* Classic 2016-18 */
.theme-classic .btn-primary {
  background: var(--gradient-hero);
  color: #FFF;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(79,70,229,0.2);
}

.theme-classic .name-field {
  border: 1px solid rgba(0,0,0,0.08);
  background: #FFF;
  color: var(--text);
  border-radius: var(--radius-md);
}

.theme-classic .name-field::placeholder {
  color: var(--text-dim);
}

.theme-classic .theme-item {
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-md);
  background: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.theme-classic .theme-item.active {
  border-color: rgba(79,70,229,0.35);
  box-shadow: 0 4px 16px rgba(79,70,229,0.1);
}

.theme-classic .intro-heading {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Terminal */
.theme-terminal .btn-primary {
  background: #39C5BB;
  color: #1A1B26;
  border: 1px solid #39C5BB;
  border-radius: 0;
  box-shadow: 0 0 12px rgba(57,197,187,0.25);
  font-family: var(--font-mono);
}

.theme-terminal .btn-primary::before {
  content: './';
  opacity: 0.7;
}

.theme-terminal .btn-back {
  background: #24283B;
  color: #A9B1D6;
  border: 1px solid rgba(57,197,187,0.2);
  border-radius: 0;
  font-family: var(--font-mono);
}

.theme-terminal .btn-back:hover {
  background: rgba(57,197,187,0.08);
  color: #39C5BB;
}

.theme-terminal .name-field {
  border: 1px solid rgba(57,197,187,0.25);
  background: #1A1B26;
  color: #39C5BB;
  border-radius: 0;
  font-family: var(--font-mono);
}

.theme-terminal .name-field::placeholder {
  color: #565970;
}

.theme-terminal .theme-item {
  border: 1px solid rgba(57,197,187,0.15);
  border-radius: 0;
  background: #24283B;
  font-family: var(--font-mono);
}

.theme-terminal .theme-item.active {
  border-color: #39C5BB;
  box-shadow: 0 0 15px rgba(57,197,187,0.15);
}

.theme-terminal .intro-heading {
  background: none;
  -webkit-text-fill-color: #39C5BB;
  color: #39C5BB;
  font-family: var(--font-mono);
}

.theme-terminal .intro-heading::before {
  content: 'user@vai-prog:~$ echo ';
  color: #787C99;
  font-size: 0.6em;
  display: block;
  margin-bottom: 0.5rem;
}

.theme-terminal .theme-list {
  border: 1px solid rgba(57,197,187,0.15);
  padding: 1rem;
  background: #1A1B26;
}
</style>