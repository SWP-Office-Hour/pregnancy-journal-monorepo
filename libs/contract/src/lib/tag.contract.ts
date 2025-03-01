import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

export const tagResponseSchema = z.object({
  tag_id: z.string(),
  title: z.string(),
  status: statusSchema,
});

// Sử dụng omit để loại bỏ trường `tag_id` từ `tagResSchema` khi tạo mới tag
export const tagCreateRequestSchema = tagResponseSchema.omit({ tag_id: true });

export const tagUpdateRequestSchema = tagResponseSchema.extend({
  title: z.string().optional(),
  status: statusSchema.optional(),
});
const tagGetAllResSchema = z.array(tagResponseSchema);

export type Tag = z.infer<typeof tagResponseSchema>;
export type TagResponse = z.infer<typeof tagResponseSchema>;
export type TagCreateRequest = z.infer<typeof tagCreateRequestSchema>;
export type TagUpdateRequest = z.infer<typeof tagUpdateRequestSchema>;
const c = initContract();

export const tagContract = c.router({
  getAll: {
    method: 'GET',
    path: '/tags',
    description: 'Get all tags (đã xong)',
    responses: {
      200: tagGetAllResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/tags/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    description: 'Get a tag by tag id (đã xong)',
    responses: {
      200: tagResponseSchema,
      404: z.object({ message: z.string() }),
    },
  },

  getTagsByUser: {
    method: 'GET',
    path: '/tags/user/:userId',
    pathParams: z.object({
      userId: z.string(),
    }),
    description: 'Get all tags by user (đã xong)',
    responses: {
      200: tagGetAllResSchema,
      404: z.object({ message: z.string() }),
    },
  },

  create: {
    method: 'POST',
    path: '/tags',
    body: tagCreateRequestSchema,
    description: 'Create a new tag (đã xong)',
    responses: {
      201: tagResponseSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/tags',
    body: tagUpdateRequestSchema,
    description: 'Update a tag (đã xong)',
    responses: {
      200: tagResponseSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/tags/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    description: 'Delete a tag by id (đã xong)',
    responses: {
      204: z.object({
        message: z.string(),
      }),
    },
  },
});
