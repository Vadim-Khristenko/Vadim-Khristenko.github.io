<template>
  <section class="lic">
    <div class="lic-inner">
      <header class="lic-head">
        <a href="/" class="lic-back">← {{ tl(T.back) }}</a>
        <p class="lic-kicker">{{ tl(T.kicker) }}</p>
        <h1 class="lic-title">{{ tl(T.title) }}</h1>
        <p class="lic-sub">{{ tl(T.sub) }}</p>
      </header>

      <div class="lic-grid">
        <!-- Source code -->
        <article class="lic-card">
          <div class="lic-card-top">
            <Code2 :size="20" />
            <div>
              <h2>{{ tl(T.code.title) }}</h2>
              <span class="lic-badge">VKPPL · v1.0</span>
            </div>
          </div>
          <p class="lic-body">{{ tl(T.code.body) }}</p>

          <div class="lic-rules">
            <div class="lic-col ok">
              <h3>✅ {{ tl(T.allowed) }}</h3>
              <ul><li v-for="(x, i) in T.code.allow" :key="i">{{ tl(x) }}</li></ul>
            </div>
            <div class="lic-col no">
              <h3>⛔ {{ tl(T.forbidden) }}</h3>
              <ul><li v-for="(x, i) in T.code.deny" :key="i">{{ tl(x) }}</li></ul>
            </div>
          </div>

          <a
            href="https://github.com/Vadim-Khristenko/Vadim-Khristenko.github.io/blob/main/LICENSE"
            target="_blank"
            rel="noopener"
            class="lic-full"
          >{{ tl(T.readFull) }} <ExternalLink :size="14" /></a>
        </article>

        <!-- Content -->
        <article class="lic-card">
          <div class="lic-card-top">
            <PenLine :size="20" />
            <div>
              <h2>{{ tl(T.content.title) }}</h2>
              <span class="lic-badge alt">VCL · v1.0</span>
            </div>
          </div>
          <p class="lic-body">{{ tl(T.content.body) }}</p>

          <div class="lic-rules">
            <div class="lic-col ok">
              <h3>✅ {{ tl(T.allowed) }}</h3>
              <ul><li v-for="(x, i) in T.content.allow" :key="i">{{ tl(x) }}</li></ul>
            </div>
            <div class="lic-col no">
              <h3>⛔ {{ tl(T.forbidden) }}</h3>
              <ul><li v-for="(x, i) in T.content.deny" :key="i">{{ tl(x) }}</li></ul>
            </div>
          </div>
        </article>
      </div>

      <footer class="lic-foot">
        <p>{{ tl(T.copyright) }}</p>
        <p class="lic-contact">
          {{ tl(T.contact) }} <a href="mailto:just@vai-prog.ru">just@vai-prog.ru</a>
        </p>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Code2, PenLine, ExternalLink } from 'lucide-vue-next';
import { useI18n } from '@/composables/useI18n';
import type { Localized } from '@/data/types';

const { tl } = useI18n();

// Content lives inline as trilingual Localized objects — keeps this long-form
// legal prose out of the shared i18n key files (and the parity check).
const L = (ru: string, en: string, zh: string): Localized => ({ ru, en, zh });

const T = {
  back: L('На главную', 'Back home', '返回首页'),
  kicker: L('Правовая информация', 'The legal bit', '法律信息'),
  title: L('Лицензии', 'Licenses', '许可'),
  sub: L(
    'Этот сайт — открытый исходный код. Код и его содержимое (посты, истории, картинки) распространяются на разных условиях. Ниже — коротко и по-человечески.',
    'This site is open source. The code and its content (posts, stories, images) ship under different terms. Here they are, in plain words.',
    '本站为开源项目。代码与内容（文章、故事、图片）采用不同的授权条款。以下为通俗说明。'
  ),
  allowed: L('Можно', 'Allowed', '允许'),
  forbidden: L('Нельзя', 'Not allowed', '禁止'),
  readFull: L('Читать полный текст лицензии', 'Read the full license', '阅读完整许可证'),
  code: {
    title: L('Исходный код', 'Source code', '源代码'),
    body: L(
      'Весь код сайта, скрипты и Rust/WASM-эксперименты открыты под VKPPL — личной некоммерческой лицензией с защитой от ИИ-обучения.',
      'All site code, scripts and the Rust/WASM experiments are open under VKPPL — a personal non-commercial license with AI-training protection.',
      '本站全部代码、脚本以及 Rust/WASM 实验均以 VKPPL 开源 — 一份带有防 AI 训练条款的个人非商业许可。'
    ),
    allow: [
      L('Учиться, читать и форкать', 'Learn, read and fork', '学习、阅读与 fork'),
      L('Некоммерческие проекты', 'Non-commercial projects', '非商业项目'),
      L('Делиться с указанием авторства', 'Share with attribution', '注明出处后分享'),
    ],
    deny: [
      L('Коммерческое использование', 'Commercial use', '商业用途'),
      L('Обучение ИИ/ML на этом коде', 'Training AI/ML on this code', '用本代码训练 AI/ML'),
      L('Удалять копирайт', 'Removing copyright notices', '删除版权声明'),
    ],
  },
  content: {
    title: L('Тексты и посты', 'Writing & posts', '文章与内容'),
    body: L(
      'Посты блога, рассказы, фанфики и изображения — авторские. Лицензия VAI Content License (VCL): читай, цитируй и делись со ссылкой, но без перепубликации целиком и без обучения ИИ.',
      'Blog posts, stories, fanfics and images are authored works. The VAI Content License (VCL): read, quote and share with a link — but no full re-publishing and no AI training.',
      '博客文章、故事、同人与图片均为原创作品。VAI 内容许可 (VCL)：可阅读、引用并附链接分享 — 但不得全文转载，也不得用于 AI 训练。'
    ),
    allow: [
      L('Читать и цитировать с указанием источника', 'Read and quote with credit', '阅读并注明出处引用'),
      L('Ссылаться и делиться ссылкой', 'Link and share the link', '链接并分享链接'),
      L('Личное некоммерческое использование', 'Personal, non-commercial use', '个人非商业使用'),
    ],
    deny: [
      L('Перепубликация постов целиком', 'Re-publishing full posts', '全文转载文章'),
      L('Обучение ИИ на текстах и картинках', 'Training AI on the text or images', '用文本或图片训练 AI'),
      L('Коммерческое использование без разрешения', 'Commercial use without permission', '未经许可的商业使用'),
    ],
  },
  copyright: L(
    '© 2025–2026 Vadim Khristenko. Все права защищены в рамках указанных лицензий.',
    '© 2025–2026 Vadim Khristenko. All rights reserved under the licenses above.',
    '© 2025–2026 Vadim Khristenko。在上述许可范围内保留所有权利。'
  ),
  contact: L('Вопросы о коммерческой лицензии:', 'Commercial licensing questions:', '商业授权咨询：'),
};
</script>

<style scoped>
.lic { padding: 120px 1.5rem 80px; min-height: 100vh; }
.lic-inner { max-width: 960px; margin: 0 auto; }

.lic-back {
  display: inline-block;
  color: var(--text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-6);
  transition: color var(--transition-fast);
}
.lic-back:hover { color: var(--text); }

.lic-kicker {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--primary);
  margin-bottom: 0.6rem;
}
.lic-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 0.75rem;
}
.lic-sub {
  color: var(--text-muted);
  max-width: 60ch;
  line-height: 1.6;
  margin-bottom: var(--space-10);
}

.lic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: var(--space-5);
}

.lic-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
}
.lic-card-top {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: var(--space-4);
  color: var(--primary);
}
.lic-card-top h2 {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.25rem;
}
.lic-badge {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 12%, transparent);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
}
.lic-badge.alt {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}

.lic-body {
  color: var(--text-muted);
  line-height: 1.65;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-5);
}

.lic-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}
.lic-col h3 {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  margin-bottom: 0.6rem;
}
.lic-col ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.45rem; }
.lic-col li {
  font-size: var(--font-size-sm);
  line-height: 1.4;
  color: var(--text-muted);
  padding-left: 0.9rem;
  position: relative;
}
.lic-col li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
}
.lic-col.ok li::before { background: #34d399; }
.lic-col.no li::before { background: #f87171; }

.lic-full {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  color: var(--primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 600;
}
.lic-full:hover { text-decoration: underline; }

.lic-foot {
  margin-top: var(--space-10);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border);
  font-size: var(--font-size-sm);
  color: var(--text-dim);
}
.lic-contact { margin-top: 0.4rem; }
.lic-contact a { color: var(--primary); text-decoration: none; }
.lic-contact a:hover { text-decoration: underline; }

@media (max-width: 480px) {
  .lic-rules { grid-template-columns: 1fr; }
}
</style>
