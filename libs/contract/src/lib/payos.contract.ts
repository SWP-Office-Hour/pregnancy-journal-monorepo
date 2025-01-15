import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const TransactionSchema = z.object({
  reference: z.string(),
  amount: z.number(),
  accountNumber: z.string(),
  description: z.string(),
  transactionDateTime: z.string(),
  virtualAccountName: z.string().nullable(),
  virtualAccountNumber: z.string().nullable(),
  counterAccountBankId: z.string().nullable(),
  counterAccountBankName: z.string().nullable(),
  counterAccountName: z.string().nullable(),
  counterAccountNumber: z.string().nullable(),
});

const PaymentLinkSchema = z.object({
  id: z.string(),
  orderCode: z.number(),
  amount: z.number(),
  amountPaid: z.number(),
  amountRemaining: z.number(),
  status: z.string(),
  createdAt: z.string(),
  transactions: z.array(TransactionSchema),
  cancellationReason: z.string().nullable(),
  canceledAt: z.string().nullable(),
});

const payosCreateReqSchema = z.object({
  orderCode: z.number(),
  amount: z.number(),
  description: z.string(),
});

const payosCreateResSchema = z.object({
  bin: z.string(),
  checkoutUrl: z.string(),
  accountNumber: z.string(),
  accountName: z.string(),
  amount: z.number(),
  description: z.string(),
  orderId: z.string(),
  qrCode: z.string(),
});

export type PayosCreate = z.infer<typeof payosCreateResSchema>;
export type PayosCreateResponse = z.infer<typeof payosCreateResSchema>;
export type PayosCreateRequest = z.infer<typeof payosCreateReqSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;

export const payosContract = c.router({
  create: {
    method: 'POST',
    path: '/payos',
    body: payosCreateReqSchema,
    responses: {
      200: payosCreateResSchema,
      404: z.object({ message: z.string() }),
    }
  },
});
