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

