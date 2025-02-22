import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { payStatusSchema } from './enum.contract';

const c = initContract();

const payosReqSchema = z.object({
  id: z.string(),
  amount: z.number(),
  description: z.string(),
  membershipId: z.string(),
  status: payStatusSchema,
  userId: z.string(),
  createdAt: z.string().date(),
});

const payosResSchema = z.object({
  bin: z.string(),
  checkoutUrl: z.string(),
  accountNumber: z.string(),
  accountName: z.string(),
  amount: z.number(),
  description: z.string(),
  orderId: z.string(),
  qrCode: z.string(),
});

export type PayosCreateResponse = z.infer<typeof payosResSchema>;
export type PayosCreateRequest = z.infer<typeof payosReqSchema>;

export const payosContract = c.router({
  create: {
    method: 'POST',
    path: '/payos',
    body: payosReqSchema,
    responses: {
      200: payosResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  getAll: {
    method: 'GET',
    path: '/payos',
    responses: {
      200: z.array(payosResSchema),
    },
  },
  getOne: {
    method: 'GET',
    path: '/payos/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: payosResSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
