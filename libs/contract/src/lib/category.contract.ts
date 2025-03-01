import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

export const categoryResponseSchema = z.object({
  category_id: z.string(),
  title: z.string(),
  status: statusSchema,
});

// Sử dụng omit để loại bỏ trường `category_id` khi tạo mới category
export const categoryCreateRequestSchema = categoryResponseSchema.omit({ category_id: true });

// Sử dụng omit để loại bỏ trường không cần thiết khi cập nhật category
export const categoryUpdateRequestSchema = categoryResponseSchema.extend({
  title: z.string().optional(),
  status: statusSchema.optional(),
});

export type Category = z.infer<typeof categoryResponseSchema>;
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type CategoryCreateRequest = z.infer<typeof categoryCreateRequestSchema>;
export type CategoryUpdateRequest = z.infer<typeof categoryUpdateRequestSchema>;

const c = initContract();

export const categoryContract = c.router({
  create: {
    method: 'POST',
    path: '/categories',
    description: 'Create a new category (đã xong)',
    body: categoryCreateRequestSchema,
    responses: {
      201: categoryResponseSchema,
    },
  },
  getAll: {
    method: 'GET',
    path: '/categories',
    description: 'Get all categories (đã xong)',
    responses: {
      200: z.array(categoryResponseSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/categories/:id',
    description: 'Get a category by id (đã xong)',
    responses: {
      200: categoryResponseSchema,
      404: z.object({ message: z.string() }),
    },
  },
  update: {
    method: 'PATCH',
    path: '/categories',
    description: 'Update a category by category id (đã xong)',
    body: categoryUpdateRequestSchema,
    responses: {
      200: categoryResponseSchema,
      404: z.object({ message: z.string() }),
    },
  },
  delete: {
    method: 'DELETE',
    path: '/categories/:id',
    description: 'Delete a category by id (đã xong)',
    responses: {
      200: categoryResponseSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
