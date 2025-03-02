// standard.contract.ts
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

// Base schema
export const standardSchema = z.object({
  standard_id: z.string(),
  week: z.number(),
  lowerbound: z.number(),
  upperbound: z.number(),
  who_standard_value: z.number().nullable(),
  metric_id: z.string(),
});

// Create request schema
export const standardCreateRequestSchema = standardSchema
  .omit({
    standard_id: true, // Loại bỏ trường `standard_id`
  })
  .extend({
    week: z.number().min(0).max(50), // Thêm validation cho `week`
  });

// Update request schema
export const standardUpdateRequestSchema = standardSchema
  .omit({
    metric_id: true, // Loại bỏ trường `metric_id`
  })
  .extend({
    week: z.number().min(0).max(50).optional(), // Thêm validation và làm cho `week` tùy chọn
    lowerbound: z.number().optional(), // Làm cho `lowerbound` tùy chọn
    upperbound: z.number().optional(), // Làm cho `upperbound` tùy chọn
    who_standard_value: z.number().nullable().optional(), // Làm cho `who_standard_value` tùy chọn// Làm cho `metric_id` tùy chọn
  });

export type Standard = z.infer<typeof standardSchema>;
export type StandardCreateRequest = z.infer<typeof standardCreateRequestSchema>;
export type StandardUpdateReq = z.infer<typeof standardUpdateRequestSchema>;

const c = initContract();

export const standardContract = c.router({
  getAllStandardByMetricId: {
    method: 'GET',
    path: '/standards/:metric_id',
    pathParams: z.object({
      metric_id: z.string(),
    }),
    description: 'Get all standards by metric id',
    responses: {
      200: z.array(standardSchema).nullable(),
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/standards',
    description: 'Create a standard',
    body: standardCreateRequestSchema,
    responses: {
      201: standardSchema,
      400: z.object({ message: z.string() }),
    },
  },
  update: {
    method: 'PATCH',
    path: '/standards',
    description: 'Update a standard',
    body: standardUpdateRequestSchema,
    responses: {
      200: standardSchema,
      400: z.object({ message: z.string() }),
    },
  },
  delete: {
    method: 'DELETE',
    path: '/standards/:standard_id',
    description: 'Delete a standard',
    pathParams: z.object({
      standard_id: z.string(),
    }),
    responses: {
      204: z.object({}),
      400: z.object({ message: z.string() }),
    },
  },
});
