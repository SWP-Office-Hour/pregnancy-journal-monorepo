import { z } from 'zod';
import { initContract } from '@ts-rest/core';

export const reminderSchema = z.object({
  id: z.string(),
  // type: reminderTypeSchema,
  title: z.string(),
  content: z.string(),
  remind_date: z.date(),
  // status: reminderStatusSchema,
  created_at: z.date(),
  updated_at: z.date(),
});

export type c_reminderType = z.infer<typeof reminderSchema>;
