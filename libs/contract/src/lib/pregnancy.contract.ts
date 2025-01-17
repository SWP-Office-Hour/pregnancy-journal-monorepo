import {z} from 'zod';
import {initContract} from '@ts-rest/core';
import { metricUserResSchema } from './metric.contract';

export const metricValueSchema = z.array(z.object(
  {
    id: z.string(),
    value: z.number(),
    metric: metricUserResSchema,
  }
));

const pregnancyResSchema = z.array(
  z.object(
    {
      id: z.string(),
      week: z.number(),
      expected_birth_date: z.date(),
      next_visit_date: z.date(),
      visit_doctor_date: z.date(),
      hospital: z.string(),
      data: z.array(metricValueSchema),
    }
));
