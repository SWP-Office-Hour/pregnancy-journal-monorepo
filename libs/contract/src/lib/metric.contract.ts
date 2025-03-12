import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';
import { tagResponseSchema } from './tag.contract';

// METRIC ============================================

export const metricResponseSchema = z.object({
  metric_id: z.string(),
  title: z.string(),
  measurement_unit: z.string(),
  status: statusSchema,
  required: z.boolean(),
  upperbound_msg: z.string(),
  lowerbound_msg: z.string(),
  tag: tagResponseSchema.optional(),
});

// Create Request Schema
const metricCreateRequestSchema = metricResponseSchema
  .extend({
    tag_id: z.string().optional(),
  })
  .omit({
    metric_id: true,
    tag: true,
  });
// Update Request Schema
const metricUpdateRequestSchema = metricResponseSchema
  .omit({
    tag: true,
  })
  .extend({
    metric_id: z.string(), // Ensure metric_id is required
    title: z.string().optional(),
    measurement_unit: z.string().optional(),
    upperbound_msg: z.string().optional(),
    lowerbound_msg: z.string().optional(),
    required: z.boolean().optional(),
    status: statusSchema.optional(),
    tag_id: z.string().optional(),
  });

export type HealthMetric = z.infer<typeof metricResponseSchema>;

export type MetricResponseType = z.infer<typeof metricResponseSchema>;

export type MetricCreateRequestType = z.infer<typeof metricCreateRequestSchema>;

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
      204: metricResponseSchema,
    },
  },
});
