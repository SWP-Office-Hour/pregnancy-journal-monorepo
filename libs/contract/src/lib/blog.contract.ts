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
  tags: z.array(tagResSchema.optional()).optional(),
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

export type BlogResponse = z.infer<typeof blogResSchema>;
export type BlogCreateRequest = z.infer<typeof blogCreateReqSchema>;
export type BlogUpdateRequest = z.infer<typeof blogUpdateReqSchema>;

const c = initContract();

export const blogContract = c.router({
  getAll: {
    method: 'GET',
    path: '/blogs',
    query: z.object({
      limit: z.coerce.number().min(0).default(10),
      page: z.coerce.number().min(1).default(1),
    }),
    description: 'Get all blogs (đã xong)',
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
    description: 'Get a blog by blog id (đã xong)',
    responses: {
      200: blogResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/blogs',
    description: 'Create a new blog (đã xong)',
    body: blogCreateReqSchema,
    responses: {
      201: blogResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/blogs',
    description: 'Update a blog (đã xong)',
    body: blogUpdateReqSchema,
    responses: {
      200: blogResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/blogs/:id',
    description: 'Delete a blog by blog id (đã xong)',
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
