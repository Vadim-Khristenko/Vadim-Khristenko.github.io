import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    editDate: z.coerce.date().optional(),
    draft: z.boolean().optional(),
    category: z.enum(['Код', 'Жизнь', 'Творчество', 'Размышления']).optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().default('Вадим'),
    readTime: z.number().optional(),
    featured: z.boolean().optional(),
    coverImage: z.string().optional(),
    color: z.string().default('from-cyan-500/20 to-blue-500/10'),
    readLevel: z.number().min(1).max(8).default(3),
  })
});

export const collections = { posts };
