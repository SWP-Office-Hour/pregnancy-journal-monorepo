import { z } from 'zod';
import { initContract } from '@ts-rest/core';

const dashboardResSchema = z.object({
  date: z.date(),
  totalUser: z.number(),
  paidUser: z.number(),
  avgRevenue: z.number(),
  totalBlog: z.number(),
});

const dashboardUserResSchema = z.array(
  z.object({
    date: z.date(),
    totalUser: z.number(),
  })
);

const dashboardRevenueResSchema = z.array(
  z.object({
    date: z.date(),
    avgRevenue: z.number(),
    currency: z.string(),
  })
);

const c = initContract();

export const dashboardContract = c.router({
  getDashboard: {
    method: 'GET',
    path: '/admin/dashboard',
    responses: {
      200: dashboardResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
  getUserDashboard: {
    method: 'GET',
    path: '/admin/user',
    responses: {
      200: dashboardUserResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
  getRevenueDashboard: {
    method: 'GET',
    path: '/admin/revenue',
    responses: {
      200: dashboardRevenueResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
});
