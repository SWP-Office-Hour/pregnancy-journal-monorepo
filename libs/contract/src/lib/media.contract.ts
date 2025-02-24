import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const mediaResSchema = z.object({
  media_id: z.string(),
  media_url: z.string(),
});

export type MediaResponse = z.infer<typeof mediaResSchema>;

const c = initContract();

export const mediaContract = c.router({
  // updateFile: {
  //   method: 'POST',
  //   path: '/media',
  //   contentType: 'multipart/form-data',
  //   description: 'Upload a image',
  //   query: z.object({
  //     post_id: z.string().optional(),
  //     record_id: z.string().optional(),
  //   }),
  //   body: c.type<{ thumbnail: File }>(),
  //   responses: {
  //     200: mediaResSchema,
  //     400: z.object({
  //       message: z.string(),
  //     }),
  //   },
  // },
  updateFile: {
    method: 'POST',
    path: '/multi_media',
    description: 'Upload a image',
    query: z.object({
      post_id: z.string().optional(),
      record_id: z.string().optional(),
    }),
    body: z.array(mediaResSchema),
    responses: {
      200: mediaResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },

  updateMultiFiles: {
    method: 'PATCH',
    path: '/multi_media',
    description: 'Upload multiple images',
    query: z.object({
      post_id: z.string().optional(),
      record_id: z.string().optional(),
    }),
    body: mediaResSchema.array(),
    responses: {
      200: z.array(mediaResSchema),
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
    description: 'Get a image by media id',
    responses: {
      200: z.object({ media: mediaResSchema, imgLink: z.string() }),
      400: z.object({
        message: z.string(),
      }),
    },
  },
  deleteFile: {
    method: 'DELETE',
    path: '/media/:id',
    description: 'Delete a image by media id',
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
