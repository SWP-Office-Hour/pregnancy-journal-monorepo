import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { StreamableFile } from '@nestjs/common';

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
        url: z.string(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
  },
  // getFile: {
  //   method: 'GET',
  //   path: '/file/:filename',
  //   responses: {
  //     200: z.string(),
  //     400: z.object({
  //       message: z.string(),
  //     }),
  //   },
  // },
  getLink: {
    method: 'GET',
    path: '/file/:filename',
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
