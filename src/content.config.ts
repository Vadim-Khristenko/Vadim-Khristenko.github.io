import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  // Astro content-layer loader (Astro 5+/7)
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('VAI_PROG'),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['ru', 'en', 'zh']).default('ru'),
    cover: z.string().optional(),
    /* posts sharing a translationKey are language versions of one article */
    translationKey: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
