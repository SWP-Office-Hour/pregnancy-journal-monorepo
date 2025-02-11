import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

export const noteResSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  date: z.date(),
  status: statusSchema,
  created_at: z.date(),
});

const noteCreateReqSchema = z.object({
  title: z.string(),
  content: z.string(),
  date: z.date(),
  status: statusSchema,
});
const noteUpdateReqSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  date: z.date().optional(),
  status: statusSchema.optional(),
});

export type Note = z.infer<typeof noteResSchema>;

const c = initContract();

export const noteContract = c.router({
  getAll: {
    method: 'GET',
    path: '/note',
    description: 'Get all notes',
    responses: {
      200: z.array(noteResSchema),
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/note/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    description: 'Get a note by note id',
    responses: {
      200: noteResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/note',
    body: noteCreateReqSchema,
    description: 'Create a new note',
    responses: {
      201: noteResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/note/:id',
    body: noteUpdateReqSchema,
    description: 'Update a note by note id',
    responses: {
      200: noteResSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/note/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    description: 'Delete a note by note id',
    responses: {
      204: z.object({
        message: z.string(),
      }),
    },
  },
});
