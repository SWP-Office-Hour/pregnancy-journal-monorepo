
import { z } from 'zod';
import { initContract } from '@ts-rest/core';

export const mediaResSchema = z.object({
  id: z.string(),
  url: z.string(),
});
const c = initContract();

export const mediaContract = c.router({
  updateFile: {
    method: 'POST',
    path: '/file',
    contentType: 'multipart/form-data', // <- Only difference
    body: c.type<{ thumbnail: File }>(), // <- Use File type in here
    responses: {
      200: mediaResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
  getFile: {
    method: 'GET',
    path: '/file/:filename',
    responses: {
      200: mediaResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
  deleteFile: {
    method: 'DELETE',
    path: '/file/:filename',
    responses: {
      200: z.object({
        message: z.string(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
  },
});
