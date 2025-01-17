import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import { statusSchema, membershipDaySchema } from './enum.contract';

const membershipResContract = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  createAt: z.date(),
  status: statusSchema,
  expiredInDay: membershipDaySchema,
});

const membershipCreateReqContract = z.object({
  title: z.string(),
  price: z.number(),
  description: z.string(),
  status: statusSchema,
  expiredInDay: membershipDaySchema,
});

const membershipUpdateReqContract = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  status: statusSchema,
  expiredInDay: membershipDaySchema,
});

const c = initContract();

export const membershipContract = c.router({
  getAll: {
    method: 'GET',
    path: '/memberships',
    responses: {
      200: z.array(membershipResContract),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/memberships/:id',
    responses: {
      200: membershipResContract,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/memberships',
    body: membershipCreateReqContract,
    responses: {
      201: membershipResContract,
    },
  },
  update: {
    method: 'PATCH',
    path: '/memberships/:id',
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
    responses: {
      204: z.object({
        message: z.string(),
      }),
    },
  },
});
