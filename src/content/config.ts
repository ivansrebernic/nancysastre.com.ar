import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Nancy Sastre'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.enum(['nutricion', 'ejercicio', 'negocio', 'testimonios', 'productos']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    instagramCaption: z.string().optional(),
  }),
});

export const collections = { blog };