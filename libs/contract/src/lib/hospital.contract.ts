import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const hospitalResponseSchema = z.object({
  hospital_id: z.string(),
  name: z.string(),
  city: z.string(),
});

export const hospitalGetAllResponseSchema = z.array(hospitalResponseSchema);

export const hospitalCreateRequestSchema = hospitalResponseSchema.omit({ hospital_id: true });
export const hospitalUpdateRequestSchema = hospitalResponseSchema.extend({
  name: z.string().optional(),
  city: z.string().optional(),
});

export type Hospital = z.infer<typeof hospitalResponseSchema>;

export type HospitalResponse = z.infer<typeof hospitalResponseSchema>;
export type HospitalCreateRequestType = z.infer<typeof hospitalCreateRequestSchema>;
export type HospitalUpdateRequestType = z.infer<typeof hospitalUpdateRequestSchema>;

const c = initContract();

export const hospitalContract = c.router({
  getAll: {
    method: 'GET',
    path: '/hospitals',
    description: 'Get all hospitals (đã xong)',
    responses: {
      200: hospitalGetAllResponseSchema,
    },
  },
  getOne: {
    method: 'GET',
    path: '/hospitals/:id',
    description: 'Get a hospital by id (đã xong)',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: hospitalResponseSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/hospitals',
    description: 'Create a new hospital (đã xong)',

    body: hospitalCreateRequestSchema,
    responses: {
      200: hospitalResponseSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/hospitals',
    description: 'Update a hospital by id (đã xong)',
    body: hospitalUpdateRequestSchema,
    responses: {
      200: hospitalResponseSchema,
    },
  },
});
