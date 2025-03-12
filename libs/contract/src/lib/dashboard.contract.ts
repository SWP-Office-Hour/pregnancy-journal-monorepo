import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const DashboardOverviewSchema = z.object({
  data: z.array(
    z.object({
      label: z.string(),
      total: z.number(),
      currentMonth: z.number(),
    }),
  ),
});
export const DashboardUserSchema = z.object({
  memberData: z.array(z.number()),
  subscriberData: z.array(z.number()),
});

export const DashboardPaymentSchema = z.object({
  payment: z.array(z.number()),
  membership: z.array(z.number()),
});

export const DashboardSchema = z.object({
  overview: DashboardOverviewSchema,
  user: DashboardUserSchema,
  payment: DashboardPaymentSchema,
});

export type DashboardType = z.infer<typeof DashboardSchema>;
export type DashboardOverviewType = z.infer<typeof DashboardOverviewSchema>;
export type DashboardUserType = z.infer<typeof DashboardUserSchema>;
export type DashboardPaymentType = z.infer<typeof DashboardPaymentSchema>;
const c = initContract();

export const dashboardContract = c.router({
  // Overview endpoint
  getDashboard: {
    method: 'GET',
    path: '/admin/dashboard',
    description: 'Get dashboard data ',
    responses: {
      200: DashboardSchema,
    },
  },
});
