import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sections = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sections' }),
  schema: z.object({
    title: z.string().min(1),
    section: z.enum([
      'about',
      'benefits',
      'licensing',
      'join-us',
      'wnr',
      'social-rides',
      'conduct',
    ]),
  }),
});

export const collections = { sections };
