import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en', 'zh'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  site: 'https://vai-rice.space',
  vite: {
    ssr: {
      noExternal: ['pinia', 'vue-demi', '@vueuse/core']
    },
    resolve: {
      alias: {
        'vue-demi': 'vue-demi/lib/index.mjs'
      }
    }
  }
});