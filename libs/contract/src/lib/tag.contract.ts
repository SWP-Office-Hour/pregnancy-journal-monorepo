import {z} from 'zod';
import {initContract} from '@ts-rest/core';
import { statusSchema } from './enum.contract';


export const tagResSchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.date(),
  status: statusSchema,
});

const tagGetAllResSchema = z.array(tagResSchema);
