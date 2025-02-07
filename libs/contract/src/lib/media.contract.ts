import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const mediaResSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export type MediaRes = z.infer<typeof mediaResSchema>;

const c = initContract();

export const mediaContract = c.router({
  updateFile: {
    method: 'POST',
    path: '/media',
    contentType: 'multipart/form-data',
    query: z.object({
      post_id: z.string().optional(),
      record_id: z.string().optional(),
    }),
    body: c.type<{ thumbnail: File }>(),
    responses: {
      200: mediaResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },

  // getFile: {
  //   method: 'GET',
  //   path: '/media/:filename',
  //   responses: {
  //     200: z.string(),
  //     400: z.object({
  //       message: z.string(),
  //     }),
  //   },
  // },
  getLink: {
    method: 'GET',
    path: '/media/:id',
    responses: {
      200: mediaResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
  deleteFile: {
    method: 'DELETE',
    path: '/media/:id',
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
