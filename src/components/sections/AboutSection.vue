<template>
  <section id="about" class="about">
    <div class="about-inner">
      <header class="sec-header">
        <h2>{{ t('about.title') }}</h2>
        <p>{{ t('about.subtitle') }}</p>
      </header>

      <div class="about-grid">
        <!-- Main card -->
        <div class="about-main">
          <p class="about-desc">{{ t('about.desc') }}</p>

          <div class="about-quad">
            <div class="q-item">
              <div class="q-icon" style="color: #A78BFA;">
                <Brain :size="20" />
              </div>
              <h4>{{ t('about.ml') }}</h4>
              <p>{{ t('about.ml.desc') }}</p>
            </div>
            <div class="q-item">
              <div class="q-icon" style="color: #60A5FA;">
                <Server :size="20" />
              </div>
              <h4>{{ t('about.devops') }}</h4>
              <p>{{ t('about.devops.desc') }}</p>
            </div>
            <div class="q-item">
              <div class="q-icon" style="color: #34D399;">
                <Zap :size="20" />
              </div>
              <h4>{{ t('about.exp') }}</h4>
              <p>{{ t('about.exp.desc') }}</p>
            </div>
            <div class="q-item">
              <div class="q-icon" style="color: #FBBF24;">
                <Workflow :size="20" />
              </div>
              <h4>{{ t('about.work') }}</h4>
              <p>{{ t('about.work.desc') }}</p>
            </div>
          </div>
        </div>

        <!-- Side cards -->
        <div class="about-side">
          <div class="side-card">
            <div class="side-icon" style="color: #F472B6;">
              <Music :size="18" />
            </div>
            <h4>{{ t('about.music') }}</h4>
            <p>{{ t('about.music.desc') }}</p>
          </div>
          <div class="side-card">
            <div class="side-icon" style="color: #60A5FA;">
              <BookOpen :size="18" />
            </div>
            <h4>{{ t('about.vibes') }}</h4>
            <p>{{ t('about.vibes.desc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Brain, Server, Zap, Workflow, Music, BookOpen } from 'lucide-vue-next';
import { useI18n } from '@/composables/useI18n';

const { t } = useI18n();
</script>

<style scoped>
.about {
  padding: var(--space-24) 1.5rem;
  position: relative;
}

.about-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.sec-header {
  margin-bottom: var(--space-8);
}

.sec-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.sec-header p {
  color: var(--text-muted);
  font-size: var(--font-size-lg);
}

.about-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-6);
}

.about-main {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
}

.about-desc {
  font-size: var(--font-size-base);
  line-height: 1.7;
  color: var(--text-muted);
  margin-bottom: var(--space-8);
}

.about-quad {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.q-item h4 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text);
  margin: 0.625rem 0 0.375rem;
}

.q-item p {
  font-size: var(--font-size-sm);
  color: var(--text-dim);
  line-height: 1.5;
}

.q-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: currentColor;
  background-opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.03);
}

.about-side {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.side-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  flex: 1;
}

.side-card h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin: 0.625rem 0 0.375rem;
}

.side-card p {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.5;
}

.side-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.03);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-quad { grid-template-columns: 1fr; }
  .about { padding: var(--space-16) 1rem; }
}

/* Theme overrides */
[data-theme="win95"] .about-main,
[data-theme="win95"] .side-card {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
  color: #000;
}

[data-theme="macclassic"] .about-main,
[data-theme="macclassic"] .side-card {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
  box-shadow: 2px 2px 0 #000;
}

[data-theme="classic"] .about-main,
[data-theme="classic"] .side-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

[data-theme="terminal"] .about-main,
[data-theme="terminal"] .side-card {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.15);
  background: #24283B;
  font-family: var(--font-mono);
}
</style>