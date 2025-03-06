import { initContract } from '@ts-rest/core';
import { Info } from 'luxon';
import { z } from 'zod';
import weekdays = Info.weekdays;

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
  }),
);

const dashboardRevenueResSchema = z.array(
  z.object({
    date: z.date(),
    avgRevenue: z.number(),
    currency: z.string(),
  }),
);

const githubIssuesSchema = z.object({
  overview: z.object({
    data: z.object({
      newIssues: z.number(),
      closedIssues: z.number(),
    }),
  }),
  labels: z.array(z.string()),
  series: z.object({
    data: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        data: z.array(z.number()),
      }),
    ),
  }),
});

const taskDistributionSchema = z.object({
  overview: z.object({
    data: z.object({
      new: z.number(),
      completed: z.number(),
    }),
  }),
  labels: z.array(z.string()),
  series: z.object({
    data: z.array(z.number()),
  }),
});

const scheduleSchema = z.object({
  today: z.array(
    z.object({
      title: z.string(),
      time: z.date(),
      location: z.string().optional(),
    }),
  ),
});

const projectSchema = z.object({
  githubIssues: githubIssuesSchema,
  taskDistribution: taskDistributionSchema,
  schedule: scheduleSchema,
});

export type GithubIssuesType = z.infer<typeof githubIssuesSchema>;
export type TaskDistribution = z.infer<typeof taskDistributionSchema>;
export type Schedule = z.infer<typeof scheduleSchema>;
export type Project = z.infer<typeof projectSchema>;

const c = initContract();

export const dashboardContract = c.router({
  getDashboard: {
    method: 'GET',
    path: '/admin/dashboard',
    description: 'Get dashboard data about users, revenue, and blogs',
    responses: {
      200: projectSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
  getUserDashboard: {
    method: 'GET',
    path: '/admin/user',
    description: 'Get dashboard data about users',
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
    description: 'Get dashboard data about revenue',
    responses: {
      200: dashboardRevenueResSchema,
      400: z.object({
        message: z.string(),
      }),
    },
  },
});
