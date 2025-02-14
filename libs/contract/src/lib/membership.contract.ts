import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

const membershipResContract = z.object({
  membership_id: z.string(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  // create_at: z.date(),
  status: statusSchema,
  // expiredInDay: membershipDaySchema,
});

const membershipCreateReqContract = z.object({
  title: z.string(),
  price: z.number(),
  description: z.string(),
  status: statusSchema,
  // expiredInDay: membershipDaySchema,
});

const membershipUpdateReqContract = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  status: statusSchema,
  // expiredInDay: membershipDaySchema,
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
