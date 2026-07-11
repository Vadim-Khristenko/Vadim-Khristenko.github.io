<template>
  <div class="blog-root">
    <nav class="blog-nav">
      <a href="/" class="blog-nav-home"><BrandMark :size="20" /> VAI_PROG</a>
      <span class="blog-nav-tag">{{ t('blog.journal') }}</span>
      <span class="blog-nav-spacer"></span>
      <BlogControls />
    </nav>

    <div class="blog-page">
      <div class="blog-wrap">
        <header class="blog-masthead">
          <div class="blog-kicker">{{ t('blog.journal') }} · {{ articles.length }} {{ tc('blog.entries', articles.length) }}</div>
          <h1>{{ t('blog.title') }}</h1>
          <p>{{ t('blog.subtitle') }}</p>

          <!-- search + tag filter -->
          <div class="blog-search">
            <span class="blog-search-ico">⌕</span>
            <input v-model="query" type="text" :placeholder="t('blog.search')" />
            <button v-if="query || activeTag" class="blog-search-clear" @click="query = ''; activeTag = ''">✕</button>
          </div>
          <div v-if="allTags.length" class="blog-tagbar">
            <button :class="['blog-tagchip', { active: !activeTag }]" @click="activeTag = ''">{{ t('blog.allTags') }}</button>
            <button
              v-for="tag in allTags"
              :key="tag"
              :class="['blog-tagchip', { active: activeTag === tag }]"
              @click="activeTag = activeTag === tag ? '' : tag"
            >#{{ tag }}</button>
          </div>
          <hr class="blog-rule" />
        </header>

        <!-- featured (only when browsing, not searching) -->
        <a v-if="featured" class="blog-featured" :href="`/blog/${featured.slug}/`">
          <span class="feat-label">{{ t('blog.latest') }}</span>
          <h2>{{ featured.title }}</h2>
          <p class="feat-desc">{{ featured.description }}</p>
          <div class="blog-entry-meta" style="text-align:left;margin-bottom:1rem">
            {{ fmtDate(featured.date, featured.lang) }} <span class="dot">·</span> {{ featured.readMin }} {{ t('blog.min') }} {{ t('blog.read') }}
          </div>
          <span class="blog-read">{{ t('blog.readPost') }} →</span>
        </a>

        <div v-if="list.length" class="blog-list">
          <a v-for="(post, i) in list" :key="post.slug" class="blog-entry" :href="`/blog/${post.slug}/`">
            <span class="blog-entry-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="blog-entry-main">
              <div class="blog-entry-title">{{ post.title }}</div>
              <p class="blog-entry-desc">{{ post.description }}</p>
              <div class="blog-entry-tags">
                <span v-for="tag in post.tags" :key="tag" class="blog-tag" @click.prevent="activeTag = tag">#{{ tag }}</span>
              </div>
            </div>
            <div class="blog-entry-meta">
              {{ fmtDate(post.date, post.lang) }}<br />
              {{ post.readMin }} {{ t('blog.min') }} · {{ post.lang.toUpperCase() }}
            </div>
          </a>
        </div>

        <div v-if="!featured && list.length === 0" class="blog-empty">
          <p>{{ posts.length === 0 ? t('blog.noResults') : t('blog.noResults') }}</p>
        </div>
      </div>
    </div>

    <BlogFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
setActivePinia(createPinia());
import { useI18n } from '@/composables/useI18n';
import BlogControls from './BlogControls.vue';
import BlogFooter from './BlogFooter.vue';
import BrandMark from '../ui/BrandMark.vue';

interface Post { slug: string; title: string; description: string; tags: string[]; lang: string; date: string; readMin: number; translationKey: string; }
const props = defineProps<{ posts: Post[] }>();
const { t, tc, locale } = useI18n();

const query = ref('');
const activeTag = ref('');

/* one entry per article — pick the language version matching the current locale */
const articles = computed<Post[]>(() => {
  const groups = new Map<string, Post[]>();
  props.posts.forEach((p) => {
    const arr = groups.get(p.translationKey) || [];
    arr.push(p);
    groups.set(p.translationKey, arr);
  });
  const order = [locale.value, 'ru', 'en', 'zh'];
  const picked: Post[] = [];
  groups.forEach((versions) => {
    let chosen: Post | undefined;
    for (const l of order) { chosen = versions.find((v) => v.lang === l); if (chosen) break; }
    picked.push(chosen || versions[0]);
  });
  return picked.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const allTags = computed(() => {
  const s = new Set<string>();
  articles.value.forEach((p) => p.tags.forEach((tg) => s.add(tg)));
  return [...s].sort();
});

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase().replace(/^#/, '');
  return articles.value.filter((p) => {
    if (activeTag.value && !p.tags.includes(activeTag.value)) return false;
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((tg) => tg.toLowerCase().includes(q))
    );
  });
});

const searching = computed(() => !!query.value.trim() || !!activeTag.value);
const featured = computed(() => (!searching.value ? articles.value[0] : null));
const list = computed(() => (featured.value ? filtered.value.slice(1) : filtered.value));

function fmtDate(iso: string, lang: string) {
  const loc = lang === 'ru' ? 'ru-RU' : lang === 'zh' ? 'zh-CN' : 'en-US';
  return new Date(iso).toLocaleDateString(loc, { year: 'numeric', month: 'short', day: 'numeric' });
}

onMounted(() => {
  const tag = new URLSearchParams(window.location.search).get('tag');
  if (tag && allTags.value.includes(tag)) activeTag.value = tag;
});
</script>
