import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import { reminderTypeSchema, statusSchema } from './enum.contract';

export const reminderResSchema = z.object({
  id: z.string(),
  type: reminderTypeSchema,
  title: z.string(),
  content: z.string(),
  remindDate: z.date(),
  status: statusSchema,
  created_at: z.date(),
});

export const reminderCreateReqSchema = z.object({
  type: reminderTypeSchema,
  title: z.string(),
  content: z.string(),
  remindDate: z.string().date(),
  status: statusSchema,
  user_id: z.string(),
});

export const reminderUpdateReqSchema = z.object({
  id: z.string(),
  type: reminderTypeSchema.optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  remindDate: z.string().date().optional(),
  status: statusSchema.optional(),
  user_id: z.string().optional(),
});

export type Reminder = z.infer<typeof reminderResSchema>;
export type ReminderCreateReq = z.infer<typeof reminderCreateReqSchema>;
export type ReminderUpdateReq = z.infer<typeof reminderUpdateReqSchema>;

const c = initContract();

export const reminderContract = c.router({
  getAll: {
    method: 'GET',
    path: '/reminders',
    responses: {
      200: z.array(reminderResSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/reminders/:id',
    responses: {
      200: reminderResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/reminders',
    body: reminderCreateReqSchema,
    responses: {
      201: reminderResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/reminders',
    body: reminderUpdateReqSchema,
    responses: {
      200: reminderResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/reminders/:id',
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
