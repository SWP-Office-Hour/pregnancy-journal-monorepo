import {z} from 'zod';
import {initContract} from '@ts-rest/core';
import { tagResSchema } from './tag.contract';

const boundSchema = z.object({
  id: z.string(),
  week: z.number(),
  lower: z.number(),
  upper: z.number(),
});

const metricResSchema = z.object({
  id: z.string(),
  title: z.string(),
  measure: z.string(),
  bound: z.array(boundSchema),
  tags: z.array(tagResSchema),
});
