import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import { metricUserResSchema } from './metric.contract';

export type pregnancyResponse = z.infer<typeof pregnancyResSchema>;
export type pregnancyUpdateRequest = z.infer<typeof pregnancyUpdateReqSchema>;

export const metricValueSchema = z.array(
  z.object({
    id: z.string(),
    value: z.number(),
    metric: metricUserResSchema,
  }),
);

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

const pregnancyUpdateReqSchema = z.object({
  id: z.string(),
  week: z.number().optional(),
  expectedBirthDate: z.date().optional(),
  nextVisitDate: z.date().optional(),
  visitDoctorDate: z.date().optional(),
  hospital: z.string().optional(),
  data: metricValueSchema.optional(),
});

const c = initContract();

export const pregnancyContract = c.router({
  getAllPregnancies: {
    method: 'GET',
    path: '/pregnancy',
    description: 'Get all pregnancies',
    responses: {
      200: pregnancyResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
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
  updatePregnancy: {
    method: 'PUT',
    path: '/pregnancy/:id',
    description: 'Update pregnancy by user id',
    body: pregnancyUpdateReqSchema,
    responses: {
      200: pregnancyResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
});
