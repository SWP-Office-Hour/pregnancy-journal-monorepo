import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import { statusSchema } from './enum.contract';

export const tagResSchema = z.object({
  id: z.string(),
  title: z.string(),
  createAt: z.date(),
  status: statusSchema,
});

export const tagCreateReqSchema = z.object({
  title: z.string(),
  status: statusSchema,
});

export const tagUpdateReqSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  status: statusSchema.optional(),
});

const tagGetAllResSchema = z.array(tagResSchema);

export type Tag = z.infer<typeof tagResSchema>;
const c = initContract();

export const tagContract = c.router({
  getAll: {
    method: 'GET',
    path: '/tags',
    responses: {
      200: tagGetAllResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/tags/:id',
    responses: {
      200: tagResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/tags',
    body: tagCreateReqSchema,
    responses: {
      201: tagResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/tags/:id',
    body: tagUpdateReqSchema,
    responses: {
      200: tagResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/tags/:id',
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