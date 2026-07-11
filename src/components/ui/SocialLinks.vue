<template>
  <div v-if="items.length" class="social-links">
    <a
      v-for="(s, i) in items"
      :key="i"
      :href="s.url"
      target="_blank"
      rel="noopener"
      class="social-link"
      :title="titleFor(s)"
      :aria-label="titleFor(s)"
      :style="accent ? { '--sl-accent': accent } : undefined"
    >
      <svg
        v-if="brandFor(s.kind)"
        class="brand-ico"
        viewBox="0 0 24 24"
        width="15"
        height="15"
        aria-hidden="true"
      >
        <path :d="brandFor(s.kind)?.path" fill="currentColor" />
      </svg>
      <component v-else :is="genericIcon(s.kind)" :size="15" />
      <span v-if="s.label || s.labelKey" class="social-label">{{ labelText(s) }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Globe, Mail, Link } from 'lucide-vue-next';
import {
  siGithub, siTelegram, siDiscord, siX, siYoutube, siTwitch, siInstagram, siTiktok, siVk, siMatrix,
} from 'simple-icons';
import { useI18n } from '@/composables/useI18n';
import type { Localized } from '@/composables/useI18n';
import type { Social, SocialKind } from '@/data/types';

const props = defineProps<{ socials?: Social[]; website?: string; accent?: string }>();

const { t, tl } = useI18n();

const items = computed<Social[]>(() => {
  const list = [...(props.socials ?? [])];
  if (props.website && !list.some((s) => s.url === props.website)) {
    list.push({ kind: 'website', url: props.website });
  }
  return list;
});

// Real brand logos (simple-icons) for the platforms that have one.
type Brand = { path: string };
const BRAND: Partial<Record<SocialKind, Brand>> = {
  github: siGithub,
  telegram: siTelegram,
  discord: siDiscord,
  x: siX,
  twitter: siX,
  youtube: siYoutube,
  twitch: siTwitch,
  instagram: siInstagram,
  tiktok: siTiktok,
  vk: siVk,
  matrix: siMatrix,
};

function brandFor(kind: SocialKind): Brand | undefined {
  return BRAND[kind];
}

// generic (non-brand) kinds fall back to a clean lucide glyph
function genericIcon(kind: SocialKind) {
  switch (kind) {
    case 'email': return Mail;
    case 'link': return Link;
    default: return Globe;
  }
}

// localized default names for the generic kinds (brands keep their proper name)
const GENERIC_NAME: Partial<Record<SocialKind, Localized>> = {
  website: { ru: 'Сайт', en: 'Website', zh: '网站' },
  link: { ru: 'Ссылка', en: 'Link', zh: '链接' },
  email: { ru: 'Почта', en: 'Email', zh: '邮箱' },
};

function labelText(s: Social): string {
  if (s.labelKey) return t(s.labelKey as any);
  return s.label ? tl(s.label) : '';
}
function hasLabel(s: Social): boolean {
  return !!(s.label || s.labelKey);
}
function titleFor(s: Social): string {
  const lt = labelText(s);
  if (lt) return lt;
  return GENERIC_NAME[s.kind] ? tl(GENERIC_NAME[s.kind]!) : s.kind;
}
</script>

<style scoped>
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
}

.social-link:hover {
  color: var(--sl-accent, var(--primary));
  border-color: var(--sl-accent, var(--border-hover));
  background: color-mix(in srgb, var(--sl-accent, var(--primary)) 8%, transparent);
}

.brand-ico { display: block; flex-shrink: 0; }

.social-label {
  font-size: var(--font-size-xs);
  font-weight: 500;
}
</style>
