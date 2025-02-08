import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { metricResSchema } from './metric.contract';

export const metricValueSchema = z.array(
  z.object({
    id: z.string(),
    value: z.number(),
    metric: metricResSchema,
  }),
);

const pregnancyUpdateReqSchema = z.object({
  id: z.string(),
  week: z.number().optional(),
  expectedBirthDate: z.date().optional(),
  nextVisitDate: z.date().optional(),
  visitDoctorDate: z.date().optional(),
  hospital: z.string().optional(),
  data: metricValueSchema.optional(),
});

export type PregnancyUpdateRequest = z.infer<typeof pregnancyUpdateReqSchema>;

export type pregnancyResponse = z.infer<typeof pregnancyResSchema>;

const pregnancyResSchema = z.array(
  z.object({
    id: z.string(),
    week: z.number(),
    expectedBirthDate: z.date(),
    nextVisitDate: z.date(),
    visitDoctorDate: z.date(),
    hospital: z.string(),
    data: metricValueSchema,
  }),
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
