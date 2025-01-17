import { z } from 'zod';
import { initContract } from '@ts-rest/core';

const dashboardResSchema = z.object({
  date: z.date(),
  total_users: z.number(),
  paid_users: z.number(),
  avg_revenue: z.number(),
  total_blogs: z.number(),
});

const dashboardUserResSchema = z.array(
  z.object({
    date: z.date(),
    total_users: z.number(),
  })
);

const dashboardRevenueResSchema = z.array(
  z.object({
    date: z.date(),
    avg_revenue: z.number(),
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
