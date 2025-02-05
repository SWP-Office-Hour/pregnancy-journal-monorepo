import { initContract } from '@ts-rest/core';
import { z } from 'zod';

type UpdateFileBody = {
  additionData: {
    post_id: string;
    record_id: string;
  };
};

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
      200: z.object({
        message: z.string(),
        name: z.string(),
        url: z.string(),
      }),
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
    path: '/media/:filename',
    responses: {
      200: z.object({
        link: z.string(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
  },
  deleteFile: {
    method: 'DELETE',
    path: '/media/:filename',
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
