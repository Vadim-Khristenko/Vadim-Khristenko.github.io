<template>
  <section id="drops" class="drops">
    <div class="drops-inner">
      <header class="sec-header">
        <h2>{{ t('drops.title') }}</h2>
        <p>{{ t('drops.subtitle') }}</p>
      </header>

      <div class="drops-grid">
        <div v-for="d in drops" :key="d.name" class="drop-card">
          <div class="drop-glow"></div>
          <div class="drop-domain">{{ d.url.replace('https://', '') }}</div>
          <h3>{{ t(d.nameKey) }}</h3>
          <p>{{ t(d.descKey) }}</p>
          <div class="drop-tags">
            <span v-for="tag in d.tags" :key="tag" class="drop-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';

const { t } = useI18n();

const drops = [
  { nameKey: 'drop.snackers.name', descKey: 'drop.snackers.desc', url: 'https://snackers.vai-rice.space', tags: ['Vue', 'AI', 'Community', 'i18n'] },
  { nameKey: 'drop.tlbas.name', descKey: 'drop.tlbas.desc', url: 'https://tlbas.vai-rice.space', tags: ['Rust', 'Matrix', 'MTProto', 'P2P'] },
  { nameKey: 'drop.via.name', descKey: 'drop.via.desc', url: 'https://via.vai-rice.space', tags: ['AI', 'Multi-platform', 'LLM'] },
  { nameKey: 'drop.viaos.name', descKey: 'drop.viaos.desc', url: 'https://via-os.vai-rice.space', tags: ['OS', 'Kernel', 'Rust', 'From Scratch'] },
  { nameKey: 'drop.vaiexia.name', descKey: 'drop.vaiexia.desc', url: 'https://vaiexia.vai-rice.space', tags: ['Vue', 'Go', 'DevOps'] },
];
</script>

<style scoped>
.drops {
  padding: var(--space-24) 1.5rem;
}

.drops-inner {
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

.drops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-4);
}

.drop-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  overflow: hidden;
  transition: all var(--transition-base);
}

.drop-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.drop-card:first-child {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, rgba(255,107,157,0.08), rgba(124,58,237,0.08));
  border-color: rgba(255,107,157,0.2);
}

.drop-card:first-child:hover {
  border-color: rgba(255,107,157,0.4);
}

.drop-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, var(--primary), transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.drop-card:hover .drop-glow {
  opacity: 0.05;
}

.drop-domain {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--primary);
  margin-bottom: var(--space-3);
  letter-spacing: 0.05em;
}

.drop-card h3 {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.drop-card p {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-3);
}

.drop-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.drop-tag {
  font-size: var(--font-size-xs);
  padding: 0.25rem 0.625rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text-dim);
}

@media (max-width: 640px) {
  .drops-grid { grid-template-columns: 1fr; }
  .drop-card:first-child { grid-column: 1; }
  .drops { padding: var(--space-16) 1rem; }
}

/* Theme overrides */
[data-theme="win95"] .drop-card {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
  color: #000;
}

[data-theme="macclassic"] .drop-card {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
  box-shadow: 2px 2px 0 #000;
}

[data-theme="classic"] .drop-card {
  border-radius: 0;
  border: 1px solid rgba(0,255,65,0.15);
  background: rgba(0,255,65,0.03);
}

[data-theme="classic"] .drop-card p { color: #00AA2A; }
[data-theme="classic"] .drop-domain { color: #00FF41; }
[data-theme="classic"] .drop-tag {
  border-color: rgba(0,255,65,0.2);
  color: #00AA2A;
}
</style>