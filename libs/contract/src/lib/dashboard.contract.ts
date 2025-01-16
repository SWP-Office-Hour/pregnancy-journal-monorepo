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

