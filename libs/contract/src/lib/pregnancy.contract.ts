import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import { metricUserResSchema } from './metric.contract';

export const metricValueSchema = z.array(
  z.object({
    id: z.string(),
    value: z.number(),
    metric: metricUserResSchema,
  })
);

const pregnancyResSchema = z.array(
  z.object({
    id: z.string(),
    week: z.number(),
    expectedBirthDate: z.date(),
    nextVisitDate: z.date(),
    visitDoctorDate: z.date(),
    hospital: z.string(),
    data: z.array(metricValueSchema),
  })
);

const c = initContract();

export const pregnancyContract = c.router({
  getPregnancyById: {
    method: 'GET',
    path: '/pregnancy/:id',
    description: 'Get pregnancy by user id',
    responses: {
      200: pregnancyResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
});