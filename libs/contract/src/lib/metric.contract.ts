import {z} from 'zod';
import {initContract} from '@ts-rest/core';
import { tagResSchema } from './tag.contract';
import { statusSchema } from './enum.contract';

const boundSchema = z.object({
  id: z.string(),
  week: z.number(),
  lower: z.number(),
  upper: z.number(),
});

export const metricResSchema = z.object({
  id: z.string(),
  title: z.string(),
  measure: z.string(),
  bound: z.array(boundSchema),
  upper_bound_msg: z.string(),
  lower_bound_msg: z.string(),
  tags: z.array(tagResSchema),
  status: statusSchema,
});

export const metricUserResSchema = z.object({
  id: z.string(),
  title: z.string(),
  measure: z.string(),
  upper_bound_msg: z.string(),
  lower_bound_msg: z.string(),
  bound: boundSchema,
});

const metricGetAllResSchema = z.array(metricResSchema);
