import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';

// Base schema with all fields
const noteResSchema = z.object({
  note_id: z.string(),
  title: z.string(),
  content: z.string(),
  date: z.date(),
  status: statusSchema,
});

// Schema for creating a note (omits note_id since it's generated server-side)
const noteCreateReqSchema = noteResSchema.omit({ note_id: true }).extend({
  date: z.string().datetime(), // Override date to be a string in ISO 8601 format
});

// Schema for updating a note (all fields are optional except note_id)
const noteUpdateReqSchema = noteResSchema
  .omit({ date: true }) // Omit date since it's overridden
  .partial() // Make all fields optional except note_id
  .extend({
    note_id: z.string(), // Ensure note_id is required
    date: z.string().datetime().optional(),
  });

export type NoteResponse = z.infer<typeof noteResSchema>;
export type NoteCreateRequest = z.infer<typeof noteCreateReqSchema>;
export type NoteUpdateRequest = z.infer<typeof noteUpdateReqSchema>;

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
