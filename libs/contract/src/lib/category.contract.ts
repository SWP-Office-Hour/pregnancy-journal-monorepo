import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import { statusSchema } from './enum.contract';

const CategoryResSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: statusSchema,
});

const CategoryCreateReqSchema = z.object({
  title: z.string(),
  status: statusSchema,
});

const CategoryUpdateReqSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  status: statusSchema.optional(),
});

export type CategoryRes = z.infer<typeof CategoryResSchema>;
export type CategoryCreateReq = z.infer<typeof CategoryCreateReqSchema>;
export type CategoryUpdateReq = z.infer<typeof CategoryUpdateReqSchema>;

const c = initContract();

export const categoryContract = c.router({
  create: {
    method: 'POST',
    path: '/categories',
    body: CategoryCreateReqSchema,
    responses: {
      201: CategoryResSchema,
    },
  },

  getAll: {
    method: 'GET',
    path: '/categories',
    responses: {
      200: z.array(CategoryResSchema),
      404: z.object({ message: z.string() }),
    },
  },

  getOne: {
    method: 'GET',
    path: '/categories/:id',
    responses: {
      200: CategoryResSchema,
      404: z.object({ message: z.string() }),
    },
  },

  update: {
    method: 'PATCH',
    path: '/categories',
    body: CategoryUpdateReqSchema,
    responses: {
      200: CategoryResSchema,
    },
  },

  delete: {
    method: 'DELETE',
    path: '/categories/:id',
    responses: {
      200: CategoryResSchema,
    },
  },
});
