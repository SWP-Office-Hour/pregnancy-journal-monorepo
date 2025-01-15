import { z } from 'zod';
import { initContract } from '@ts-rest/core';

export enum reminderStatus {

}

export enum reminderType {

}

export const reminderStatusSchema = z.nativeEnum(reminderStatus);
export const reminderTypeSchema = z.nativeEnum(reminderType);

export const reminderSchema = z.object({
  id: z.string(),
  type: reminderTypeSchema,
  title: z.string(),
  content: z.string(),
  remindDate: z.date(),
  status: reminderStatusSchema,
  created_at: z.date(),
  updated_at: z.date(),
});

export type c_reminderType = z.infer<typeof reminderSchema>;
