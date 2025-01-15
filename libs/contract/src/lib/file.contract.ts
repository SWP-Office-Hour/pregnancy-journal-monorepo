import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const fileContract = c.router({
  updateFile: {
    method: 'POST',
    path: '/file',
    contentType: 'multipart/form-data', // <- Only difference
    body: c.type<{ thumbnail: File }>(), // <- Use File type in here
    responses: {
      200: z.object({
        message: z.string(),
        name: z.string(),
        // path: z.string(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
  },
  getFile: {
    method: 'GET',
    path: '/file/:filename',
    responses: {
      200: z.object({
        message: z.string(),
        path: z.string(),
      }),
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
