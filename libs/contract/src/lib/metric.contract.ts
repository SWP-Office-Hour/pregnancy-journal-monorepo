import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

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
  required: z.boolean(),
  status: statusSchema,
});

const metricCreateReqSchema = z.object({
  title: z.string(),
  measurement_unit: z.string(),
  standard: z.array(standardCreateReqSchema.optional()).optional(),
  upperBoundMsg: z.string(),
  lowerBoundMsg: z.string(),
  required: z.boolean(),
  status: statusSchema,
});

const metricUpdateReqSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().optional(),
  measurement_unit: z.string().optional(),
  upperBoundMsg: z.string().optional(),
  lowerBoundMsg: z.string().optional(),
  required: z.boolean().optional(),
  status: statusSchema.optional(),
});

export type MetricResponse = z.infer<typeof metricResSchema>;
export type MetricCreateRequest = z.infer<typeof metricCreateReqSchema>;
export type MetricUpdateRequest = z.infer<typeof metricUpdateReqSchema>;
const c = initContract();

export const metricContract = c.router({
  getAll: {
    method: 'GET',
    path: '/metrics',
    description: 'Get all metrics (đã xong)',
    responses: {
      200: z.array(metricResSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/metrics/:id',
    description: 'Get a metric by metric id (đã xong)',
    responses: {
      200: metricResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/metrics',
    description: 'Create a new metric (đã xong)',
    body: metricCreateReqSchema,
    responses: {
      200: metricResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/metrics',
    description: 'Update a metric by metric id (đã xong)',
    body: metricUpdateReqSchema,
    responses: {
      200: metricResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/metrics/:id',
    description: 'Delete a metric by metric id (đã xong)',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      204: z.object({}),
    },
  },
});
