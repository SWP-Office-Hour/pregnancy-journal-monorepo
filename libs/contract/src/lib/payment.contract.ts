import { membershipResponseContract, payMethodSchema, payStatusSchema } from '@pregnancy-journal-monorepo/contract';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const paymentSchema = z.object({
  payment_history_id: z.string(),
  user_id: z.string(),
  membership: membershipResponseContract,
  value: z.number(),
  created_at: z.date(),
  status: payStatusSchema,
  payment_method: payMethodSchema,
  expired_at: z.date().nullable(),
});

const paymentIncludeUserInfoSchema = paymentSchema.extend({
  user: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
});

const paymentCreateReqSchema = paymentSchema
  .omit({
    payment_history_id: true,
    created_at: true,
    user_id: true,
    membership: true,
    status: true,
    value: true,
    payment_method: true,
    expired_at: true,
  })
  .extend({
    membership_id: z.string(),
  });

const paymentUpdateReqSchema = paymentSchema.omit({
  created_at: true,
  user_id: true,
  membership: true,
  value: true,
  payment_method: true,
  status: true,
  expired_at: true,
});

const paymentResSchema = z.object({
  payment: paymentSchema,
  payment_url: z.string(),
});

export type PaymentCreateRequestType = z.infer<typeof paymentCreateReqSchema>;
export type PaymentUpdateRequestType = z.infer<typeof paymentUpdateReqSchema>;
export type PaymentResponseWithLinkType = z.infer<typeof paymentResSchema>;
export type PaymentType = z.infer<typeof paymentSchema>;
export type PayIncludeUserInfo = z.infer<typeof paymentIncludeUserInfoSchema>;

const c = initContract();

export const paymentContract = c.router({
  create: {
    method: 'POST',
    path: '/payments',
    description: 'Create a new payment',
    body: paymentCreateReqSchema,
    responses: {
      200: paymentResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/payments',
    description: 'Update a payment by id',
    body: paymentUpdateReqSchema,
    responses: {
      200: paymentSchema,
    },
  },
  getAll: {
    method: 'GET',
    path: '/payments',
    description: 'Get all payments',
    responses: {
      200: z.array(paymentIncludeUserInfoSchema),
    },
  },
  // getLinkPayment: {
  //   method: 'GET',
  //   path: '/payments/:payment_history_id',
  //   pathParams: z.object({
  //     payment_history_id: z.string(),
  //   }),
  //   description: 'Get payment link',
  //   responses: {
  //     200: z.object({
  //       payment: paymentResSchema,
  //       payment_url: z.string(),
  //     }),
  //   },
  // },
});
