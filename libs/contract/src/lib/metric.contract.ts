import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';
import { tagResSchema } from './tag.contract';

// STANDARD ============================================

export const standardSchema = z.object({
  standard_id: z.string(),
  week: z.number(),
  lowerbound: z.number(),
  upperbound: z.number(),
  who_standard_value: z.number().nullable(),
});

export const standardCreateReqSchema = z.object({
  week: z.number().min(0).max(40),
  lowerbound: z.number(),
  upperbound: z.number(),
  who_standard_value: z.number(),
});

export const standardUpdateReqSchema = z.object({
  standard_id: z.string(),
  week: z.number().min(0).max(40).optional(),
  lowerbound: z.number(),
  upperbound: z.number(),
  who_standard_value: z.number().optional(),
});

// METRIC ============================================

export const metricResponseSchema = z.object({
  metric_id: z.string(),
  title: z.string(),
  measurement_unit: z.string(),
  standard: z.array(standardSchema).optional(),
  upperbound_msg: z.string(),
  lowerbound_msg: z.string(),
  tag: tagResSchema.optional(),
  status: statusSchema,
  required: z.boolean(),
});

const metricCreateRequestSchema = z.object({
  title: z.string(),
  measurement_unit: z.string(),
  standard: z.array(standardCreateReqSchema).optional(),
  upperBoundMsg: z.string(),
  lowerBoundMsg: z.string(),
  required: z.boolean(),
  status: statusSchema,
});

const metricUpdateRequestSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  measurementUnit: z.string().optional(),
  upperBoundMsg: z.string().optional(),
  lowerBoundMsg: z.string().optional(),
  required: z.boolean().optional(),
  status: statusSchema.optional(),
});

export type HealthMetric = z.infer<typeof metricResponseSchema>;

export type MetricCreateRequestType = z.infer<typeof metricCreateRequestSchema>;

export type MetricResponseType = z.infer<typeof metricResponseSchema>;

export type MetricUpdateRequestType = z.infer<typeof metricUpdateRequestSchema>;

const c = initContract();

export const metricContract = c.router({
  getAll: {
    method: 'GET',
    path: '/metrics',
    description: 'Get all metrics (đã xong)',
    responses: {
      200: z.array(metricResponseSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/metrics/:id',
    description: 'Get a metric by metric id (đã xong)',
    responses: {
      200: metricResponseSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/metrics',
    description: 'Create a new metric (đã xong)',
    body: metricCreateRequestSchema,
    responses: {
      200: metricResponseSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/metrics',
    description: 'Update a metric by metric id (đã xong)',
    body: metricUpdateRequestSchema,
    responses: {
      200: metricResponseSchema,
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
