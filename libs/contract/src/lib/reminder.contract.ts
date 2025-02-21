import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { reminderTypeSchema, statusSchema } from './enum.contract';

// Base schema for common fields
const reminderBaseSchema = z.object({
  title: z.string(),
  content: z.string(),
  remind_date: z.string().date(),
});

// Schema for creating a reminder
export const reminderCreateReqSchema = reminderBaseSchema;

// Schema for updating a reminder
export const reminderUpdateReqSchema = reminderBaseSchema.partial().extend({
  reminder_id: z.string(),
});

// Schema for the reminder response
export const reminderResSchema = reminderBaseSchema
  .extend({
    reminder_id: z.string(),
    type: reminderTypeSchema,
    status: statusSchema,
  })
  .omit({ remind_date: true })
  .extend({
    remind_date: z.date(),
  });

export type ReminderResponse = z.infer<typeof reminderResSchema>;
export type ReminderCreateRequest = z.infer<typeof reminderCreateReqSchema>;
export type ReminderUpdateRequest = z.infer<typeof reminderUpdateReqSchema>;

const c = initContract();

export const reminderContract = c.router({
  getAll: {
    method: 'GET',
    path: '/reminders',
    description: 'Get all reminders (đã xong)',
    responses: {
      200: z.array(reminderResSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/reminders/:id',
    description: 'Get a reminder by id (đã xong)',
    responses: {
      200: reminderResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/reminders',
    description: 'Create a new reminder (đã xong)',
    body: reminderCreateReqSchema,
    responses: {
      201: reminderResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/reminders',
    description: 'Update a reminder (đã xong)',
    body: reminderUpdateReqSchema,
    responses: {
      200: reminderResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/reminders/:id',
    description: 'Delete a reminder by id (đã xong)',
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
