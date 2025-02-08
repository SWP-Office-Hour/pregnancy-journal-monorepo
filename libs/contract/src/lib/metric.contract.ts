import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';
import { tagResSchema } from './tag.contract';

export const standardSchema = z.object({
  id: z.string(),
  week: z.number(),
  lowerbound: z.number(),
  upperbound: z.number(),
  whoStandardValue: z.number(),
});

export const standardCreateReqSchema = z.object({
  week: z.number(),
  lowerbound: z.number(),
  upperbound: z.number(),
  whoStandardValue: z.number(),
});

export const standardUpdateReqSchema = z.object({
  id: z.string(),
  week: z.number().optional(),
  lowerbound: z.number(),
  upperbound: z.number(),
  whoStandardValue: z.number().optional(),
});

export const metricResSchema = z.object({
  id: z.string(),
  title: z.string(),
  measure: z.string(),
  standard: z.array(standardSchema),
  upperBoundMsg: z.string(),
  lowerBoundMsg: z.string(),
  tags: z.array(tagResSchema),
  status: statusSchema,
});

const metricUserCreateReqSchema = z.object({
  title: z.string(),
  measurementUnit: z.string(),
  standard: z.array(standardCreateReqSchema.optional()).optional(),
  upperBoundMsg: z.string(),
  lowerBoundMsg: z.string(),
  required: z.boolean(),
  status: statusSchema,
});

const metricUserUpdateReqSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  measurementUnit: z.string().optional(),
  upperBoundMsg: z.string().optional(),
  lowerBoundMsg: z.string().optional(),
  required: z.boolean().optional(),
  status: statusSchema.optional(),
});

export type MetricRes = z.infer<typeof metricResSchema>;
export type MetricCreateReq = z.infer<typeof metricUserCreateReqSchema>;
export type MetricUpdateReq = z.infer<typeof metricUserUpdateReqSchema>;
const c = initContract();

export const metricContract = c.router({
  getAll: {
    method: 'GET',
    path: '/metrics',
    responses: {
      200: z.array(metricResSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/metrics/:id',
    responses: {
      200: metricResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/metrics',
    body: metricUserCreateReqSchema,
    responses: {
      200: metricResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/metrics',
    body: metricUserUpdateReqSchema,
    responses: {
      200: metricResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/metrics/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      204: z.object({}),
    },
  },
});
