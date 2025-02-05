import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import { tagCreateReqSchema, tagResSchema } from './tag.contract';
import { categoryContract, categoryResSchema } from './category.contract';

const blogResSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  summary: z.string(),
  content_url: z.string(),
  create_at: z.date(),
  tags: z.array(tagResSchema),
  category: categoryResSchema,
});

export const blogCreateReqSchema = z.object({
  title: z.string(),
  author: z.string(),
  summary: z.string(),
  content_url: z.string(),
  tags_id: z.array(z.string().optional()).optional(),
  category_id: z.string(),
});

export const blogUpdateReqSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  author: z.string().optional(),
  summary: z.string().optional(),
  content_url: z.string().optional(),
  tags_id: z.array(z.string().optional()).optional(),
  category_id: z.string().optional(),
});

export type Blog = z.infer<typeof blogResSchema>;
export type BlogCreateReq = z.infer<typeof blogCreateReqSchema>;
export type BlogUpdateReq = z.infer<typeof blogUpdateReqSchema>;

const c = initContract();

export const blogContract = c.router({
  getAll: {
    method: 'GET',
    path: '/blogs',
    query: z.object({
      limit: z.coerce.number().default(10),
      page: z.coerce.number().default(1),
    }),

    responses: {
      200: z.object({
        blogs: z.array(blogResSchema),
        total_page: z.number(),
      }),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/blogs/:id',
    responses: {
      200: blogResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/blogs',
    body: blogCreateReqSchema,
    responses: {
      201: blogResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/blogs',
    body: blogUpdateReqSchema,
    responses: {
      200: blogResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/blogs/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      204: z.object({
        message: z.string(),
      }),
    },
  },
});
