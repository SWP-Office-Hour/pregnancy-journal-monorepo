import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { categoryResSchema } from './category.contract';
import { tagResSchema } from './tag.contract';

const blogResponeSchema = z.object({
  blog_id: z.string(),
  title: z.string(),
  author: z.string(),
  summary: z.string(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  blog_cover: z.string(),
  tags: z.array(tagResSchema.optional()).optional(),
  category: categoryResSchema,
});

// Sử dụng omit để loại bỏ các trường không cần thiết khi tạo mới blog
export const blogCreateReqSchema = blogResponeSchema.omit({ blog_id: true, created_at: true, updated_at: true, tags: true, category: true }).extend({
  tags_id: z.array(z.string().optional()).optional(),
  category_id: z.string(),
});

// Sử dụng omit để loại bỏ các trường không cần thiết khi cập nhật blog
export const blogUpdateReqSchema = blogResponeSchema.omit({ created_at: true, updated_at: true, tags: true, category: true }).extend({
  title: z.string().optional(),
  author: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  blog_cover: z.string().optional(),
  tags_id: z.array(z.string().optional()).optional(),
  category_id: z.string().optional(),
});

export type Blog = z.infer<typeof blogResponeSchema>;

export type BlogResponseType = z.infer<typeof blogResponeSchema>;

export type BlogCreateRequestType = z.infer<typeof blogCreateReqSchema>;

export type BlogUpdateRequestType = z.infer<typeof blogUpdateReqSchema>;

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
        blogs: z.array(blogResponeSchema),
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
      200: blogResponeSchema,
      404: z.object({ message: z.string() }),
    },
  },

  getBlogByTag: {
    method: 'GET',
    path: '/blogs/tag/:tag_id',
    description: 'Get a blog by tag id (đã xong)',
    query: z.object({
      limit: z.coerce.number().min(0).default(10),
      page: z.coerce.number().min(1).default(1),
    }),
    pathParams: z.object({
      tag_id: z.array(z.string()),
    }),
    responses: {
      200: z.object({
        blogs: z.array(blogResponeSchema),
        total_page: z.number(),
      }),
      404: z.object({ message: z.string() }),
    },
  },

  create: {
    method: 'POST',
    path: '/blogs',
    description: 'Create a new blog (đã xong)',
    body: blogCreateReqSchema,
    responses: {
      201: blogResponeSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/blogs',
    description: 'Update a blog (đã xong)',
    body: blogUpdateReqSchema,
    responses: {
      200: blogResponeSchema,
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
