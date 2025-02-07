import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';
import { hospitalResSchema } from './hospital.contract';
import { mediaResSchema } from './media.contract';
import { metricResSchema } from './metric.contract';
import { tagResSchema } from './tag.contract';

export const recordMetricSchema = z.array(
  z.object({
    value: z.number(),
    metric: metricResSchema,
    metric_id: z.string(),
    metric_title: z.string(),
    metric_measure: z.string(),
    metric_upperBoundMsg: z.string(),
    metric_lowerBoundMsg: z.string(),
    standard_lowerbound: z.number(),
    standard_upperbound: z.number(),
    standard_week: z.number(),
    whoStandardValue: z.number(),
    tags: z.array(tagResSchema),
    status: statusSchema,
  }),
);

const recordMetricCreateReqSchema = z.object({
  value: z.number(),
  metric_id: z.string(),
});

const recordCreateReqSchema = z.object({
  visit_doctor_date: z.string().datetime(),
  next_visit_doctor_date: z.string().datetime(),
  hospital_id: z.string(),
  user_id: z.string(),
  data: z.array(recordMetricCreateReqSchema),
});

const recordUpdateReqSchema = z.object({
  id: z.string(),
  week: z.number().optional(),
  visit_doctor_date: z.string().datetime().optional(),
  next_visit_doctor_date: z.string().datetime().optional(),
  hospital: z.string().optional(),
  data: z.array(recordMetricSchema.optional()).optional(),
});

const recordResSchema = z.array(
  z.object({
    id: z.string(),
    week: z.number(),
    visit_doctor_date: z.string().datetime(),
    next_visit_doctor_date: z.string().datetime(),
    hospital: hospitalResSchema,
    user_id: z.string(),
    data: z.array(metricResSchema),
    media: z.array(mediaResSchema),
  }),
);

export type RecordUpdateRequest = z.infer<typeof recordUpdateReqSchema>;

export type pregnancyResponse = z.infer<typeof recordResSchema>;

const c = initContract();

export const recordContract = c.router({
  createRecord: {
    method: 'POST',
    path: '/record',
    description: 'Create a new record',
    body: recordCreateReqSchema,
    responses: {
      200: recordResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },

  getPregnancyById: {
    method: 'GET',
    path: '/record/:id',
    description: 'Get pregnancy by user id',
    responses: {
      200: recordMetricSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
});
