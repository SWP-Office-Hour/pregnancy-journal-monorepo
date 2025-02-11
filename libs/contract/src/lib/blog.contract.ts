import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { categoryResSchema } from './category.contract';
import { tagResSchema } from './tag.contract';

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
    description: 'Get all blogs',
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
    description: 'Get a blog by blog id',
    responses: {
      200: blogResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/blogs',
    description: 'Create a new blog',
    body: blogCreateReqSchema,
    responses: {
      201: blogResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/blogs',
    description: 'Update a blog',
    body: blogUpdateReqSchema,
    responses: {
      200: blogResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/blogs/:id',
    description: 'Delete a blog by blog id',
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
