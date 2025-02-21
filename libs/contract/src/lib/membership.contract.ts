import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

export const membershipResContract = z.object({
  membership_id: z.string(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  status: statusSchema,
  // expiredInDay: membershipDaySchema,
});

// Sử dụng omit để loại bỏ các trường không cần thiết khi tạo mới membership
const membershipCreateReqContract = membershipResContract.omit({
  membership_id: true,
  created_at: true,
  updated_at: true,
});

// Sử dụng omit để loại bỏ các trường không cần thiết khi cập nhật membership
const membershipUpdateReqContract = membershipResContract.omit({
  created_at: true,
  updated_at: true,
});

export type membershipCreateRequest = z.infer<typeof membershipCreateReqContract>;
export type membershipUpdateRequest = z.infer<typeof membershipUpdateReqContract>;
export type membershipResponse = z.infer<typeof membershipResContract>;

const c = initContract();

export const membershipContract = c.router({
  getAll: {
    method: 'GET',
    path: '/memberships',
    description: 'Get all memberships (đã xong)',
    responses: {
      200: z.array(membershipResContract),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/memberships/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    description: 'Get a membership by membership id (đã xong)',
    responses: {
      200: membershipResContract,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/memberships',
    description: 'Create a new membership (đã xong)',
    body: membershipCreateReqContract,
    responses: {
      201: membershipResContract,
    },
  },
  update: {
    method: 'PATCH',
    path: '/memberships',
    description: 'Update a membership by membership id (đã xong)',
    body: membershipUpdateReqContract,
    responses: {
      200: membershipResContract,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/memberships/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    description: 'Delete a membership by membership id (đã xong)',
    responses: {
      204: z.object({
        message: z.string(),
      }),
    },
  },
});
