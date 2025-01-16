import {z} from 'zod';
import {initContract} from '@ts-rest/core';
import { statusSchema } from './enum.contract';
import { mediaResSchema } from './media.contract';
import { tagResSchema } from './tag.contract';

const blogResSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createAt: z.date(),
  status: statusSchema,
  media: z.array(mediaResSchema),
  tags: z.array(tagResSchema),
});

const blogGetAllResSchema = z.array(blogResSchema);
