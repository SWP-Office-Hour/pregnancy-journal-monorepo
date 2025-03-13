import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { genderSchema } from './enum.contract';

export const childSchema = z.object({
  child_id: z.string(),
  name: z.string(),
  expected_birth_date: z.date(),
  gender: genderSchema.nullable(),
  user_id: z.string(),
});

export const childCreateRequestSchema = childSchema.omit({ child_id: true, user_id: true }).extend({
  gender: genderSchema.optional(),
  expected_birth_date: z.string().date(),
});

export const childUpdateRequestSchema = childSchema.omit({ user_id: true }).partial().extend({
  child_id: z.string(),
  expected_birth_date: z.string().date().optional(),
});

export type ChildType = z.infer<typeof childSchema>;
export type ChildCreateRequestType = z.infer<typeof childCreateRequestSchema>;
export type ChildUpdateRequestType = z.infer<typeof childUpdateRequestSchema>;

const c = initContract();

export const childContract = c.router({
  create: {
    method: 'POST',
    path: '/child',
    description: 'Create a new child (đã xong)',
    body: childCreateRequestSchema,
    responses: {
      201: childSchema,
    },
  },
  getAll: {
    method: 'GET',
    path: '/child',
    description: 'Get all child (đã xong)',
    responses: {
      200: z.array(childSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/child/:id',
    description: 'Get a child by id (đã xong)',
    responses: {
      200: childSchema,
      404: z.object({ message: z.string() }),
    },
  },
  update: {
    method: 'PATCH',
    path: '/child',
    description: 'Update a child by child id (đã xong)',
    body: childUpdateRequestSchema,
    responses: {
      200: childSchema,
      404: z.object({ message: z.string() }),
    },
  },
  delete: {
    method: 'DELETE',
    path: '/child/:id',
    description: 'Delete a child by id (đã xong)',
    responses: {
      200: childSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
