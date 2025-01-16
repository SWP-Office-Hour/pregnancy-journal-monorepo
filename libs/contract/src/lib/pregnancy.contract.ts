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
      expectedBirthDate: z.date(),
      nextVisitDate: z.date(),
      visitDoctorDate: z.date(),
      hospital: z.string(),
      data: z.array(metricValueSchema),
    }
));
