import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import { tagResSchema } from './tag.contract';
import { statusSchema } from './enum.contract';

export const boundSchema = z.object({
  id: z.string(),
  week: z.number(),
  lower: z.number(),
  upper: z.number(),
});

export const boundCreateReqSchema = z.object({
  week: z.number(),
  lower: z.number(),
  upper: z.number(),
});

export const boundUpdateReqSchema = z.object({
  id: z.string(),
  week: z.number().optional(),
  lower: z.number().optional(),
  upper: z.number().optional(),
});

export const metricResSchema = z.object({
  id: z.string(),
  title: z.string(),
  measure: z.string(),
  bound: z.array(boundSchema),
  upper_bound_msg: z.string(),
  lower_bound_msg: z.string(),
  tags: z.array(tagResSchema),
  status: statusSchema,
});

export const metricUserResSchema = z.object({
  id: z.string(),
  title: z.string(),
  measure: z.string(),
  upper_bound_msg: z.string(),
  lower_bound_msg: z.string(),
  bound: boundSchema,
});

const metricUserCreateReqSchema = z.object({
  title: z.string(),
  measure: z.string(),
  bound: boundSchema,
  upperBoundMsg: z.string(),
  lowerBoundMsg: z.string(),
  tags: z.array(z.string()),
  status: statusSchema,
});

const metricUserUpdateReqSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  measure: z.string().optional(),
  bound: boundSchema.optional(),
  upperBoundMsg: z.string().optional(),
  lowerBoundMsg: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: statusSchema.optional(),
});

const c = initContract();

export const metricContract = c.router({
  getAll: {
    method: 'GET',
    path: '/metric',
    responses: {
      200: z.array(metricResSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/metric/:id',
    responses: {
      200: metricResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/metric',
    body: metricUserCreateReqSchema,
    responses: {
      201: metricResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/metric/:id',
    body: metricUserUpdateReqSchema,
    responses: {
      200: metricResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/metric/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      204: z.object({}),
    },
  },
  createBound: {
    method: 'POST',
    path: '/metric/bound',
    body: boundCreateReqSchema,
    responses: {
      201: boundSchema,
    },
  },
  getAllBound: {
    method: 'GET',
    path: '/metric/bound',
    responses: {
      200: z.array(boundSchema),
      404: z.object({ message: z.string() }),
    },
  },
  updateBound: {
    method: 'PATCH',
    path: '/metric/bound',
    body: boundUpdateReqSchema,
    responses: {
      200: boundSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
