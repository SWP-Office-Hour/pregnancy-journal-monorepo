import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

export const tagResSchema = z.object({
  tag_id: z.string(),
  title: z.string(),
  status: statusSchema,
});

// Sử dụng omit để loại bỏ trường `tag_id` từ `tagResSchema` khi tạo mới tag
export const tagCreateReqSchema = tagResSchema.omit({ tag_id: true });

export const tagUpdateReqSchema = tagResSchema.extend({
  title: z.string().optional(),
  status: statusSchema.optional(),
});
const tagGetAllResSchema = z.array(tagResSchema);

export type TagResponse = z.infer<typeof tagResSchema>;
export type TagCreateRequest = z.infer<typeof tagCreateReqSchema>;
export type TagUpdateRequest = z.infer<typeof tagUpdateReqSchema>;
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
      200: tagResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/tags',
    body: tagCreateReqSchema,
    description: 'Create a new tag (đã xong)',
    responses: {
      201: tagResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/tags',
    body: tagUpdateReqSchema,
    description: 'Update a tag (đã xong)',
    responses: {
      200: tagResSchema,
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
