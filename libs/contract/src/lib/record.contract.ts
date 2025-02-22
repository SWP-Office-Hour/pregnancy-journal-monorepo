import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema } from './enum.contract';
import { hospitalResSchema } from './hospital.contract';
import { mediaResSchema } from './media.contract';
import { tagResSchema } from './tag.contract';

export const recordMetricSchema = z.object({
  value: z.number(),
  metric_id: z.string(),
  metric_title: z.string(),
  metric_measure: z.string(),
  metric_upperBoundMsg: z.string(),
  metric_lowerBoundMsg: z.string(),
  standard_lowerbound: z.number(),
  standard_upperbound: z.number(),
  standard_week: z.number(),
  whoStandardValue: z.number(),
  tags: tagResSchema,
  status: statusSchema,
});

const recordMetricCreateReqSchema = z.object({
  value: z.number(),
  metric_id: z.string(),
});

const recordMetricUpdateReqSchema = z.object({
  value: z.number().optional(),
  metric_id: z.string().optional(),
});

const recordCreateReqSchema = z.object({
  visit_doctor_date: z.string().datetime(),
  next_visit_doctor_date: z.string().datetime(),
  hospital_id: z.string(),
  doctor_name: z.string(),
  data: z.array(recordMetricCreateReqSchema),
});

const recordUpdateReqSchema = recordCreateReqSchema
  .omit({
    visit_doctor_date: true,
    next_visit_doctor_date: true,
    hospital_id: true,
    doctor_name: true,
    data: true,
  })
  .extend({
    visit_record_id: z.string(),
    visit_doctor_date: z.string().datetime().optional(),
    next_visit_doctor_date: z.string().datetime().optional(),
    hospital_id: z.string().optional(),
    doctor_name: z.string().optional(),
    data: z.array(recordMetricUpdateReqSchema).optional(),
  });

const recordResSchema = recordCreateReqSchema
  .omit({
    hospital_id: true,
  })
  .extend({
    visit_record_id: z.string(),
    week: z.number(),
    visit_doctor_date: z.date(),
    next_visit_doctor_date: z.date(),
    hospital: hospitalResSchema,
    media: z.array(mediaResSchema),
  });

export type RecordCreateRequest = z.infer<typeof recordCreateReqSchema>;
export type RecordUpdateRequest = z.infer<typeof recordUpdateReqSchema>;

export type RecordResponse = z.infer<typeof recordResSchema>;

const c = initContract();

export const recordContract = c.router({
  createRecord: {
    method: 'POST',
    path: '/record',
    description: 'Create a new record (đã xong)',
    body: recordCreateReqSchema,
    responses: {
      200: recordResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },

  getRecordByUserId: {
    method: 'GET',
    path: '/record',
    description: 'Get pregnancy by user id (đã xong)',
    responses: {
      200: z.object({
        total: z.number(),
        data: z.array(recordResSchema),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
  },

  updateRecord: {
    method: 'PATCH',
    path: '/record',
    description: 'Update a record (đã xong)',
    body: recordUpdateReqSchema,
    responses: {
      200: recordResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },

  deleteRecord: {
    method: 'DELETE',
    path: '/record/:id',
    description: 'Delete a record (đã xong)',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
  },
});
