import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const PostSchema = z.object({
  post_id: z.string(),
  content: z.string(),
  user_id: z.string(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
});

export const PostCreateSchema = PostSchema.omit({ post_id: true, created_at: true, updated_at: true, user_id: true });

export const PostUpdateSchema = PostSchema.omit({ created_at: true, updated_at: true, user_id: true });

export type PostType = z.infer<typeof PostSchema>;
export type PostCreateType = z.infer<typeof PostCreateSchema>;
export type PostUpdateType = z.infer<typeof PostUpdateSchema>;

const c = initContract();

export const PostContract = c.router({
  create: {
    method: 'POST',
    path: '/posts',
    body: PostCreateSchema,
    responses: {
      200: PostSchema,
    },
  },

  getAll: {
    method: 'GET',
    path: '/posts',
    responses: {
      200: z.object({
        total: z.number(),
        data: z.array(PostSchema),
      }),
    },
  },

  getOne: {
    method: 'GET',
    path: '/posts/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: PostSchema,
    },
  },

  update: {
    method: 'PATCH',
    path: '/posts',
    body: PostUpdateSchema,
    responses: {
      200: PostSchema,
    },
  },

  delete: {
    method: 'DELETE',
    path: '/posts/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
});
