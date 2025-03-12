import { genderSchema } from '@pregnancy-journal-monorepo/contract';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const childSchema = z.object({
  child_id: z.string(),
  name: z.string(),
  expected_birth_date: z.date(),
  gender: genderSchema.optional(),
  user_id: z.string(),
});

export const childCreateRequestSchema = childSchema.omit({ child_id: true, user_id: true }).extend({
  gender: genderSchema.optional(),
});

export const childUpdateRequestSchema = childSchema.omit({ user_id: true }).partial().extend({
  child_id: z.string(),
});

export type ChildType = z.infer<typeof childSchema>;
export type ChildCreateRequestType = z.infer<typeof childCreateRequestSchema>;
export type ChildUpdateRequestType = z.infer<typeof childUpdateRequestSchema>;

const c = initContract();

// export const categoryContract = c.router({
//   create: {
//     method: 'POST',
//     path: '/categories',
//     description: 'Create a new category (đã xong)',
//     body: categoryCreateRequestSchema,
//     responses: {
//       201: categoryResponseSchema,
//     },
//   },
//   getAll: {
//     method: 'GET',
//     path: '/categories',
//     description: 'Get all categories (đã xong)',
//     responses: {
//       200: z.array(categoryResponseSchema),
//       404: z.object({ message: z.string() }),
//     },
//   },
//   getOne: {
//     method: 'GET',
//     path: '/categories/:id',
//     description: 'Get a category by id (đã xong)',
//     responses: {
//       200: categoryResponseSchema,
//       404: z.object({ message: z.string() }),
//     },
//   },
//   update: {
//     method: 'PATCH',
//     path: '/categories',
//     description: 'Update a category by category id (đã xong)',
//     body: categoryUpdateRequestSchema,
//     responses: {
//       200: categoryResponseSchema,
//       404: z.object({ message: z.string() }),
//     },
//   },
//   delete: {
//     method: 'DELETE',
//     path: '/categories/:id',
//     description: 'Delete a category by id (đã xong)',
//     responses: {
//       200: categoryResponseSchema,
//       404: z.object({ message: z.string() }),
//     },
//   },
// });
