import { z } from 'zod';
import { initContract } from '@ts-rest/core';

export const hospitalResSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
});

export const hospitalGetAllResSchema = z.array(hospitalResSchema);

export type Hospital = z.infer<typeof hospitalResSchema>;

const c = initContract();

export const hospitalContract = c.router({
  getAll: {
    method: 'GET',
    path: '/hospitals',
    responses: {
      200: hospitalGetAllResSchema,
    },
  },
  getOne: {
    method: 'GET',
    path: '/hospitals/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: hospitalResSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
