<template>
  <section id="skills" class="skills">
    <div class="skills-inner">
      <header class="sec-header">
        <h2>{{ t('skills.title') }}</h2>
        <p>{{ t('skills.subtitle') }}</p>
      </header>

      <!-- Language proficiency bars (live from GitHub via the stats cron) -->
      <p v-if="totalLoc" class="lang-cap"><b>≈ {{ fmtNum(totalLoc) }}</b> {{ t('skills.locNote') }}</p>
      <div class="lang-bars">
        <div v-for="lang in topLangs" :key="lang.name" class="lang-bar">
          <div class="lang-bar-header">
            <span class="lang-name">{{ lang.name }}</span>
            <span class="lang-pct">
              <span v-if="lang.lines" class="lang-loc">~{{ fmtNum(lang.lines) }}</span>{{ lang.pct }}%
            </span>
          </div>
          <div class="lang-track">
            <div class="lang-fill" :style="{ width: lang.pct + '%', background: lang.color }"></div>
          </div>
        </div>
      </div>

      <div class="skills-grid">
        <div class="skill-col">
          <div class="skill-dot" style="background: #3B82F6; box-shadow: 0 0 12px rgba(59,130,246,0.4);"></div>
          <h3>{{ t('skills.lang') }}</h3>
          <div class="skill-tags">
            <span v-for="s in langs" :key="s" class="tag">{{ s }}</span>
          </div>
        </div>

        <div class="skill-col">
          <div class="skill-dot" style="background: #A855F7; box-shadow: 0 0 12px rgba(168,85,247,0.4);"></div>
          <h3>{{ t('skills.frameworks') }}</h3>
          <div class="skill-tags">
            <span v-for="s in frameworks" :key="s" class="tag">{{ s }}</span>
          </div>
        </div>

        <div class="skill-col">
          <div class="skill-dot" style="background: #10B981; box-shadow: 0 0 12px rgba(16,185,129,0.4);"></div>
          <h3>{{ t('skills.tools') }}</h3>
          <div class="skill-tags">
            <span v-for="s in tools" :key="s" class="tag">{{ s }}</span>
          </div>
        </div>

        <div class="skill-col">
          <div class="skill-dot" style="background: #F59E0B; box-shadow: 0 0 12px rgba(245,158,11,0.4);"></div>
          <h3>{{ t('skills.ai') }}</h3>
          <div class="skill-tags">
            <span v-for="s in aiTools" :key="s" class="tag">{{ s }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@/composables/useI18n';
import { useStats } from '@/composables/useStats';

const { t } = useI18n();
const { stats } = useStats();

// Fallback shown until the live /data/stats.json (refreshed by the stats cron) loads.
const FALLBACK_LANGS = [
  { name: 'Vue', pct: 26, color: '#4FC08D' },
  { name: 'Rust', pct: 22, color: '#DEA584' },
  { name: 'Python', pct: 18, color: '#3572A5' },
  { name: 'TypeScript', pct: 14, color: '#3178C6' },
  { name: 'Go', pct: 7, color: '#00ADD8' },
  { name: 'Kotlin', pct: 5, color: '#A97BFF' },
  { name: 'PHP', pct: 4, color: '#4F5D95' },
  { name: 'C++', pct: 3, color: '#f34b7d' },
  { name: 'Shell', pct: 1, color: '#89E051' },
];

// Live language breakdown from GitHub (bytes-based %, estimated LoC), with a fallback.
const topLangs = computed(() => {
  const ls = stats.value?.languages;
  if (ls && ls.length) return ls.slice(0, 10).map((l) => ({ name: l.name, pct: l.percent, color: l.color, lines: l.lines }));
  return FALLBACK_LANGS;
});
const totalLoc = computed(() => stats.value?.linesOfCode ?? 0);

function fmtNum(n?: number): string {
  if (!n) return '';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
  return String(n);
}

// Programming Languages (core + explored)
const langs = [
  'C', 'C++', 'Rust', 'Python', 'Kotlin', 'TypeScript', 'JavaScript',
  'Go', 'PHP', 'Shell / Bash', 'HTML5', 'CSS3', 'Lua', 'Ruby',
  'Java', 'C#', 'Swift', 'Dart', 'SQL', 'Zig', 'Nim', 'Haskell'
];

// Frameworks & Libraries (frontend + backend + systems)
const frameworks = [
  'Astro', 'React', 'Vue 3', 'Nuxt', 'Next.js', 'Svelte', 'SvelteKit',
  'SolidJS', 'Tokio', 'Aiogram 3.x', 'Pydantic', 'Zod',
  'Tailwind CSS', 'Pinia', 'shadcn/ui', 'Express', 'FastAPI',
  'Flask', 'Django', 'Rocket.rs', 'Actix Web', 'Tauri', 'Electron'
];

// Tools, DevOps & Infrastructure
const tools = [
  'Docker', 'Kubernetes', 'GitHub Actions', 'GitLab CI', 'GitHub Pages',
  'Cloudflare', 'AWS', 'MongoDB', 'PostgreSQL', 'Redis', 'RabbitMQ',
  'Elasticsearch', 'nginx', 'Systemd', 'CI/CD', 'Linux', 'Windows Server',
  'Terraform', 'Grafana', 'Prometheus', 'Git', 'Vim / Neovim'
];

// AI / ML / LLM
const aiTools = [
  'OpenAI API', 'Fine-tuning', 'Prompt Engineering', 'Qwen 3.7 Max',
  'Claude Fable 5', 'MiMo V2.5 Pro', 'LLM Integration', 'TensorFlow',
  'PyTorch', 'LangChain', 'Whisper', 'Stable Diffusion', 'RAG',
  'Vector DBs', 'Ollama'
];
</script>

<style scoped>
.skills {
  padding: var(--space-24) 1.5rem;
}

.skills-inner {
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

/* Language bars */
.lang-bars {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-10);
}

.lang-bar {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: all var(--transition-base);
}

.lang-bar:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.lang-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.lang-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text);
}

.lang-pct {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-dim);
}

.lang-cap { font-size: var(--font-size-sm); color: var(--text-dim); margin: calc(var(--space-4) * -1 + 0.25rem) 0 var(--space-6); }
.lang-cap b { color: var(--text); font-family: var(--font-mono); }
.lang-loc { color: var(--text-dim); opacity: 0.65; margin-right: 0.45rem; }

.lang-track {
  height: 6px;
  background: rgba(255,255,255,0.05);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.lang-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
  animation: fillBar 1s ease-out forwards;
}

@keyframes fillBar {
  from { width: 0 !important; }
}

/* Skills grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}

.skill-col {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  transition: all var(--transition-base);
}

.skill-col:hover {
  border-color: var(--border-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.skill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: var(--space-4);
}

.skill-col h3 {
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  margin-bottom: var(--space-4);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.375rem 0.875rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  transition: all var(--transition-fast);
  cursor: default;
}

.tag:hover {
  border-color: var(--border-hover);
  color: var(--text);
  background: rgba(255,255,255,0.08);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .skills-grid { grid-template-columns: 1fr; }
  .skills { padding: var(--space-16) 1rem; }
  .lang-bars { grid-template-columns: 1fr; }
}

/* Theme overrides */
[data-theme="win95"] .skill-col,
[data-theme="win95"] .lang-bar {
  border-radius: 0;
  border: 2px solid;
  border-color: #DFDFDF #000 #000 #DFDFDF;
  background: #C0C0C0;
}

[data-theme="win95"] .tag {
  border-radius: 0;
  background: #FFF;
  color: #000;
  border: 1px solid #808080;
}

[data-theme="win95"] .lang-track {
  background: #808080;
}

[data-theme="macclassic"] .skill-col,
[data-theme="macclassic"] .lang-bar {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
  box-shadow: 2px 2px 0 #000;
}

[data-theme="macclassic"] .tag {
  border-radius: 0;
  border: 1px solid #000;
  background: #FFF;
  color: #000;
}

[data-theme="classic"] .skill-col,
[data-theme="classic"] .lang-bar {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

[data-theme="classic"] .tag {
  background: #FAFAF9;
  border-color: rgba(0,0,0,0.06);
  color: var(--text-muted);
}

[data-theme="classic"] .tag:hover {
  color: var(--primary);
  border-color: rgba(79,70,229,0.2);
  background: #FFFFFF;
}

[data-theme="classic"] .lang-track {
  background: rgba(0,0,0,0.05);
}

[data-theme="terminal"] .skill-col,
[data-theme="terminal"] .lang-bar {
  border-radius: 0;
  border: 1px solid rgba(57,197,187,0.15);
  background: #24283B;
  font-family: var(--font-mono);
}

[data-theme="terminal"] .tag {
  border-color: rgba(57,197,187,0.2);
  color: #787C99;
  background: #1A1B26;
}

[data-theme="terminal"] .tag:hover {
  color: #39C5BB;
  border-color: #39C5BB;
}

[data-theme="terminal"] .lang-track {
  background: rgba(57,197,187,0.1);
}

[data-theme="terminal"] .lang-name,
[data-theme="terminal"] .skill-col h3 {
  color: #39C5BB;
}
</style>
