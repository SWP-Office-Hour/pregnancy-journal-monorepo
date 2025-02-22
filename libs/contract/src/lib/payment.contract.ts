import { membershipResContract, payMethodSchema, payStatusSchema, userResSchema } from '@pregnancy-journal-monorepo/contract';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const paymentResSchema = z.object({
  payment_history_id: z.string(),
  user: userResSchema,
  membership: membershipResContract,
  value: z.number(),
  created_at: z.date(),
  status: payStatusSchema,
  payment_method: payMethodSchema,
});

const paymentCreateReqSchema = paymentResSchema
  .omit({
    payment_history_id: true,
    created_at: true,
    user: true,
    membership: true,
    status: true,
    value: true,
    payment_method: true,
  })
  .extend({
    membership_id: z.string(),
  });

const paymentUpdateReqSchema = paymentResSchema.omit({
  created_at: true,
  user: true,
  membership: true,
  value: true,
  payment_method: true,
  status: true,
});

export type PaymentCreateRequestType = z.infer<typeof paymentCreateReqSchema>;
export type PaymentUpdateRequestType = z.infer<typeof paymentUpdateReqSchema>;
export type PaymentResponseType = z.infer<typeof paymentResSchema>;

const c = initContract();

export const paymentContract = c.router({
  create: {
    method: 'POST',
    path: '/payments',
    description: 'Create a new payment',
    body: paymentCreateReqSchema,
    responses: {
      200: z.object({
        payment: paymentResSchema,
        payment_url: z.string(),
      }),
    },
  },
  update: {
    method: 'PATCH',
    path: '/payments',
    description: 'Update a payment by id',
    body: paymentUpdateReqSchema,
    responses: {
      200: paymentResSchema,
    },
  },
  getLinkPayment: {
    method: 'GET',
    path: '/payments/:payment_history_id',
    pathParams: z.object({
      payment_history_id: z.string(),
    }),
    description: 'Get payment link',
    responses: {
      200: z.object({
        payment: paymentResSchema,
        payment_url: z.string(),
      }),
    },
  },
});
