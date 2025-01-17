import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import { statusSchema } from './enum.contract';
import { mediaResSchema } from './media.contract';
import { tagResSchema } from './tag.contract';

const blogResSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createAt: z.date(),
  status: statusSchema,
  media: z.array(mediaResSchema),
  tags: z.array(tagResSchema),
});

export const blogCreateReqSchema = z.object({
  title: z.string(),
  content: z.string(),
  status: statusSchema,
  media: z.array(z.string()),
  tags: z.array(z.string()),
});

export const blogUpdateReqSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  status: statusSchema.optional(),
  media: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type Blog = z.infer<typeof blogResSchema>;

const c = initContract();

export const blogContract = c.router({
  getAll: {
    method: 'GET',
    path: '/blogs',
    responses: {
      200: z.array(blogResSchema),
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
    path: '/blogs/:id',
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
