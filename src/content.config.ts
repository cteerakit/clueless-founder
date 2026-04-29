import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(),
    coverImage: z.url().optional(),
    pubDate: z.coerce.date(),
    category: z.string(),
    author: z.string().default('Teerakit Chantrakul'),
    newsletter: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
