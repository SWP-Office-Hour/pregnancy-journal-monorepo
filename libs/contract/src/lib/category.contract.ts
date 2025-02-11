import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

export const categoryResSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: statusSchema,
});

export const categoryCreateReqSchema = z.object({
  title: z.string(),
  status: statusSchema,
});

export const categoryUpdateReqSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  status: statusSchema.optional(),
});

export type CategoryRes = z.infer<typeof categoryResSchema>;
export type CategoryCreateReq = z.infer<typeof categoryCreateReqSchema>;
export type CategoryUpdateReq = z.infer<typeof categoryUpdateReqSchema>;

const c = initContract();

export const categoryContract = c.router({
  create: {
    method: 'POST',
    path: '/categories',
    description: 'Create a new category',
    body: categoryCreateReqSchema,
    responses: {
      201: categoryResSchema,
    },
  },
  getAll: {
    method: 'GET',
    path: '/categories',
    description: 'Get all categories',
    responses: {
      200: z.array(categoryResSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/categories/:id',
    description: 'Get a category by id',
    responses: {
      200: categoryResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  update: {
    method: 'PATCH',
    path: '/categories',
    description: 'Update a category by category id',
    body: categoryUpdateReqSchema,
    responses: {
      200: categoryResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  delete: {
    method: 'DELETE',
    path: '/categories/:id',
    description: 'Delete a category by id',
    responses: {
      200: categoryResSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
