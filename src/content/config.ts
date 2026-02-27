import { defineCollection, z } from 'astro:content'

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.date(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
    image: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional().default(''),

    /* For internal use */
    prevTitle: z.string().default(''),
    prevSlug: z.string().default(''),
    nextTitle: z.string().default(''),
    nextSlug: z.string().default(''),
  }),
})

const specCollection = defineCollection({
  schema: z.object({
    title: z.string().optional(),
    published: z.date().optional(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
  }),
})

const diaryCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.date(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
    mood: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    private: z.boolean().optional().default(false),
    password: z.string().optional(),
    pinned: z.boolean().optional().default(false),
  }),
})

const galleryCollection = defineCollection({
  schema: z.object({
    photos: z.array(z.object({
      title: z.string().optional().default(''),
      description: z.string().optional().default(''),
      image: z.string(), // 图片文件名，相对于 images 目录
      date: z.date().optional(),
      location: z.string().optional().default(''),
      album: z.string().optional().default('default'),
      tags: z.array(z.string()).optional().default([]),
      draft: z.boolean().optional().default(false),
    })).optional().default([]),
  }),
})

export const collections = {
  posts: postsCollection,
  spec: specCollection,
  diary: diaryCollection,
  gallery: galleryCollection,
}
