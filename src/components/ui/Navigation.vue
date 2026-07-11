<template>
  <nav class="nav" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <!-- Logo -->
      <a href="#" class="nav-logo" @click.prevent="logoClick">
        <div class="logo-icon" :class="{ miku: isMikuActive }">
          <BrandMark :size="28" />
        </div>
        <span class="logo-text" :class="{ 'miku-text': isMikuActive }">VAI-PROG</span>
      </a>

      <!-- Desktop links -->
      <div class="nav-links">
        <a v-for="l in links" :key="l.href" :href="l.href" class="nav-link">
          <component :is="l.icon" :size="14" class="nav-link-icon" />
          {{ t(l.key) }}
        </a>
      </div>

      <!-- Right -->
      <div class="nav-right">
        <!-- Lang -->
        <div class="lang">
          <button class="lang-btn" @click="langOpen = !langOpen">
            {{ locale.toUpperCase() }}
          </button>
          <Transition name="lang-drop">
            <div v-if="langOpen" class="lang-menu">
              <button
                v-for="l in availableLocales"
                :key="l.code"
                :class="['lang-opt', { active: locale === l.code }]"
                @click="setLocale(l.code); langOpen = false"
              >
                {{ l.flag }} {{ l.name }}
              </button>
            </div>
          </Transition>
        </div>

        <ModeToggle v-if="['modern', 'win95', 'macclassic', 'classic'].includes(store.theme)" />

        <ThemeSwitcher />

        <!-- Mobile toggle -->
        <button class="mob-toggle" @click="mobOpen = !mobOpen">
          <Menu v-if="!mobOpen" :size="20" />
          <X v-else :size="20" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mob-slide">
      <div v-if="mobOpen" class="mob-menu">
        <a v-for="l in links" :key="l.href" :href="l.href" class="mob-link" @click="mobOpen = false">
          <component :is="l.icon" :size="16" />
          {{ t(l.key) }}
        </a>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  Menu, X, Home, Code2, Cpu, Wrench, Users, MessageCircle,
  Globe, Sparkles, BookOpen, FlaskConical, Heart, Trophy
} from 'lucide-vue-next';
import { usePreferencesStore } from '@/stores/preferences';
import { useI18n } from '@/composables/useI18n';
import ThemeSwitcher from '../theme/ThemeSwitcher.vue';
import ModeToggle from '../modern/ModeToggle.vue';
import BrandMark from './BrandMark.vue';

const store = usePreferencesStore();
const { t, locale, availableLocales, setLocale } = useI18n();

const isScrolled = ref(false);
const mobOpen = ref(false);
const langOpen = ref(false);
const logoClicks = ref(0);
const isMikuActive = ref(false);

const links = [
  { key: 'nav.about', href: '#about', icon: Home },
  { key: 'nav.skills', href: '#skills', icon: Cpu },
  { key: 'nav.achievements', href: '#achievements', icon: Trophy },
  { key: 'nav.hiring', href: '#hiring', icon: Sparkles },
  { key: 'nav.projects', href: '#projects', icon: Code2 },
  { key: 'nav.labs', href: '#labs', icon: FlaskConical },
  { key: 'nav.friends', href: '#friends', icon: Users },
  { key: 'nav.inspirations', href: '#inspirations', icon: Heart },
  { key: 'nav.communities', href: '#communities', icon: Globe },
  { key: 'nav.contact', href: '#contact', icon: MessageCircle },
  { key: 'nav.blog', href: '/blog/', icon: BookOpen },
];

function logoClick() {
  logoClicks.value++;
  if (logoClicks.value >= 3) {
    store.findEasterEgg('miku');
    logoClicks.value = 0;
    isMikuActive.value = true;
    window.dispatchEvent(new CustomEvent('miku-activate'));
    setTimeout(() => { isMikuActive.value = false; }, 3000);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onScroll() { isScrolled.value = window.scrollY > 30; }

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 1.5rem;
  transition: all var(--transition-base);
}

.nav.scrolled {
  background: rgba(11, 11, 16, 0.85);
  backdrop-filter: blur(20px) saturate(1.2);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  color: var(--text);
  cursor: pointer;
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: var(--primary);
  transition: all 0.3s ease;
}

.logo-icon.miku {
  color: #39C5BB;
  animation: mikuPulse 0.5s ease-in-out;
}

@keyframes mikuPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3) rotate(10deg); }
}

.logo-icon svg { width: 100%; height: 100%; }

.logo-text {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: all 0.3s ease;
}

.miku-text {
  color: #39C5BB;
  text-shadow: 0 0 10px rgba(57, 197, 187, 0.5);
}

/* Links */
.nav-links {
  display: flex;
  gap: 0.125rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: var(--font-size-xs);
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: all var(--transition-fast);
  transform: translateX(-50%);
  border-radius: var(--radius-full);
}

.nav-link:hover {
  color: var(--text);
  background: var(--bg-card);
}

.nav-link:hover::after {
  width: 60%;
}

.nav-link-icon {
  opacity: 0.6;
}

/* Right */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Lang */
.lang { position: relative; }

.lang-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lang-btn:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.lang-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 0.375rem;
  min-width: 150px;
  box-shadow: var(--shadow-lg);
  z-index: 200;
}

.lang-opt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  width: 100%;
  text-align: left;
}

.lang-opt:hover {
  background: var(--bg-card);
  color: var(--text);
}

.lang-opt.active {
  color: var(--primary);
  background: var(--primary-muted);
}

/* Mobile */
.mob-toggle {
  display: none;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.mob-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(11, 11, 16, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 1.5rem;
  flex-direction: column;
  gap: 0.125rem;
}

.mob-link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: var(--font-size-base);
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.mob-link:hover {
  background: var(--bg-card);
  color: var(--text);
}

/* Transitions */
.lang-drop-enter-active, .lang-drop-leave-active { transition: all 0.2s ease; }
.lang-drop-enter-from, .lang-drop-leave-to { opacity: 0; transform: translateY(-4px); }

.mob-slide-enter-active, .mob-slide-leave-active { transition: all 0.25s ease; }
.mob-slide-enter-from, .mob-slide-leave-to { opacity: 0; transform: translateY(-8px); }

/* Responsive */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .mob-toggle { display: flex; }
  .mob-menu { display: flex; }
}

/* ===== THEME OVERRIDES ===== */
[data-theme="win95"].nav.scrolled {
  background: #C0C0C0;
  border-bottom: 2px solid #000;
}

[data-theme="win95"] .nav-links,
[data-theme="win95"] .mob-menu {
  font-family: var(--font-body);
}

[data-theme="win95"] .nav-link:hover {
  background: #000080;
  color: #FFF;
}

[data-theme="win95"] .lang-btn,
[data-theme="win95"] .mob-toggle {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
  color: #000;
}

[data-theme="win95"] .lang-menu {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
}

[data-theme="win95"] .lang-opt {
  color: #000;
  border-radius: 0;
}

[data-theme="win95"] .lang-opt:hover {
  background: #000080;
  color: #FFF;
}

[data-theme="win95"] .mob-menu {
  background: #C0C0C0;
  border-bottom: 2px solid #000;
}

[data-theme="win95"] .mob-link:hover {
  background: #000080;
  color: #FFF;
}

[data-theme="macclassic"].nav.scrolled {
  background: #F5F5DC;
  border-bottom: 1px solid #000;
}

[data-theme="macclassic"] .lang-btn,
[data-theme="macclassic"] .mob-toggle {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
}

[data-theme="macclassic"] .lang-menu {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  box-shadow: 2px 2px 0 #000;
}

[data-theme="macclassic"] .lang-opt {
  color: #000;
  border-radius: 0;
}

[data-theme="macclassic"] .lang-opt:hover {
  background: #000;
  color: #FFF;
}

[data-theme="macclassic"] .mob-menu {
  background: #F5F5DC;
  border-bottom: 1px solid #000;
}

[data-theme="macclassic"] .mob-link:hover {
  background: #000;
  color: #FFF;
}

[data-theme="classic"].nav.scrolled {
  background: rgba(250, 250, 249, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

[data-theme="classic"] .nav-link:hover {
  background: rgba(79,70,229,0.06);
  color: var(--primary);
}

[data-theme="classic"] .nav-link::after {
  background: var(--primary);
}

[data-theme="terminal"].nav.scrolled {
  background: #1A1B26;
  border-bottom: 1px solid rgba(57, 197, 187, 0.2);
}

[data-theme="terminal"] .nav-inner {
  font-family: var(--font-mono);
}

[data-theme="terminal"] .logo-text::before {
  content: '[ ';
  color: #39C5BB;
}

[data-theme="terminal"] .logo-text::after {
  content: ' ]';
  color: #39C5BB;
}

[data-theme="terminal"] .nav-link {
  font-family: var(--font-mono);
}

[data-theme="terminal"] .nav-link::before {
  content: '~/ ';
  color: #787C99;
}

[data-theme="terminal"] .nav-link:hover {
  color: #39C5BB;
  background: rgba(57,197,187,0.08);
}

[data-theme="terminal"] .nav-link::after {
  background: #39C5BB;
}

[data-theme="terminal"] .lang-btn,
[data-theme="terminal"] .mob-toggle {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.25);
  background: #24283B;
  color: #39C5BB;
  font-family: var(--font-mono);
}

[data-theme="terminal"] .lang-menu {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.25);
  background: #1A1B26;
  font-family: var(--font-mono);
}

[data-theme="terminal"] .lang-opt {
  color: #A9B1D6;
  border-radius: 0;
}

[data-theme="terminal"] .lang-opt:hover {
  background: rgba(57,197,187,0.1);
  color: #39C5BB;
}

[data-theme="terminal"] .mob-menu {
  background: #1A1B26;
  border-bottom: 1px solid rgba(57,197,187,0.2);
  font-family: var(--font-mono);
}

[data-theme="terminal"] .mob-link:hover {
  background: rgba(57,197,187,0.08);
  color: #39C5BB;
}
</style>
