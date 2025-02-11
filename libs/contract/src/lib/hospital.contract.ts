import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const hospitalResSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
});

export const hospitalGetAllResSchema = z.array(hospitalResSchema);

export type Hospital = z.infer<typeof hospitalResSchema>;

const c = initContract();

export const hospitalContract = c.router({
  getAll: {
    method: 'GET',
    path: '/hospitals',
    description: 'Get all hospitals',
    responses: {
      200: hospitalGetAllResSchema,
    },
  },
  getOne: {
    method: 'GET',
    path: '/hospitals/:id',
    description: 'Get a hospital by id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: hospitalResSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
