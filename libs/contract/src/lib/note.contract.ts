import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

export const noteResSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  date: z.date(),
  status: statusSchema,
});

const noteCreateReqSchema = z.object({
  title: z.string(),
  content: z.string(),
  date: z.string().datetime(),
  status: statusSchema,
});
const noteUpdateReqSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  date: z.string().datetime().optional(),
  status: statusSchema.optional(),
});

export type NoteRes = z.infer<typeof noteResSchema>;
export type NoteCreateReq = z.infer<typeof noteCreateReqSchema>;
export type NoteUpdateReq = z.infer<typeof noteUpdateReqSchema>;

const c = initContract();

export const noteContract = c.router({
  getAll: {
    method: 'GET',
    path: '/note',
    description: 'Get all notes (đã xong)',
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
    description: 'Get a note by note id (đã xong)',
    responses: {
      200: noteResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/note',
    body: noteCreateReqSchema,
    description: 'Create a new note (đã xong)',
    responses: {
      201: noteResSchema,
    },
  },
  update: {
    method: 'PATCH',
    path: '/note',
    body: noteUpdateReqSchema,
    description: 'Update a note by note id (đã xong)',
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
    description: 'Delete a note by note id (đã xong)',
    responses: {
      204: noteResSchema,
    },
  },
});
