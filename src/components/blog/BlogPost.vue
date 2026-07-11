<template>
  <div class="blog-root">
    <nav class="blog-nav">
      <a href="/" class="blog-nav-home"><span class="chev">←</span> VAI_PROG</a>
      <span class="blog-nav-tag">{{ t('blog.journal') }}</span>
      <span class="blog-nav-spacer"></span>
      <a href="/blog/" class="blog-nav-link">{{ t('blog.allPosts') }}</a>
      <BlogControls />
    </nav>
    <div class="blog-progress" :style="{ width: progress + '%' }"></div>

    <div class="blog-page">
      <article class="blog-wrap narrow">
        <header class="blog-post-head">
          <div class="blog-post-meta">
            <span>{{ fmtDate(active.date, active.lang) }}</span>
            <span class="dot">·</span>
            <span>{{ active.readMin }} {{ t('blog.min') }} {{ t('blog.read') }}</span>
            <span class="dot">·</span>
            <span class="accent">{{ active.author }}</span>
          </div>
          <h1>{{ active.title }}</h1>
          <p v-if="active.description" class="blog-post-lead">{{ active.description }}</p>

          <div class="blog-post-sub">
            <div class="blog-post-tags">
              <a v-for="tag in active.tags" :key="tag" class="blog-tag" :href="`/blog/?tag=${tag}`">#{{ tag }}</a>
            </div>
            <div v-if="available.length > 1" class="blog-langs" :title="'Read in another language'">
              <button
                v-for="l in available"
                :key="l.lang"
                :class="['blog-lang', { active: l.lang === active.lang }]"
                @click="setLocale(l.lang)"
              >{{ l.lang.toUpperCase() }}</button>
            </div>
          </div>
        </header>

        <div class="blog-prose" v-html="html"></div>

        <footer class="blog-post-foot">
          <a href="/blog/" class="blog-back">← {{ t('blog.allPosts') }}</a>
          <span class="blog-sign">— {{ active.author }}</span>
        </footer>
      </article>
    </div>

    <BlogFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
setActivePinia(createPinia());
import { marked } from 'marked';
import { useI18n } from '@/composables/useI18n';
import BlogControls from './BlogControls.vue';
import BlogFooter from './BlogFooter.vue';

interface PostData { title: string; description: string; tags: string[]; lang: string; date: string; author: string; readMin: number; body: string; }
const props = defineProps<{ post: PostData; translations?: PostData[] }>();
const { t, locale, setLocale } = useI18n();

const available = computed<PostData[]>(() => {
  const list = props.translations && props.translations.length ? props.translations : [props.post];
  const rank: Record<string, number> = { ru: 0, en: 1, zh: 2 };
  return [...list].sort((a, b) => (rank[a.lang] ?? 9) - (rank[b.lang] ?? 9));
});
const active = computed<PostData>(() => {
  return available.value.find((p) => p.lang === locale.value) || props.post;
});
const html = computed(() => marked.parse(active.value.body || '', { async: false }) as string);

const progress = ref(0);
function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  progress.value = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0;
}
function fmtDate(iso: string, lang: string) {
  const loc = lang === 'ru' ? 'ru-RU' : lang === 'zh' ? 'zh-CN' : 'en-US';
  return new Date(iso).toLocaleDateString(loc, { year: 'numeric', month: 'long', day: 'numeric' });
}

onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); });
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>
