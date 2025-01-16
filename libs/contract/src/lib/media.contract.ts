import {z} from 'zod';
import {initContract} from '@ts-rest/core';

export const mediaResSchema = z.object({
  id: z.string(),
  url: z.string(),
});
