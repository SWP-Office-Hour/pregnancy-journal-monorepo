import { initContract } from '@ts-rest/core';
import { z } from 'zod';

type UpdateFileBody = {
  thumbnail: File;
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
    body: c.type<UpdateFileBody>(),
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
