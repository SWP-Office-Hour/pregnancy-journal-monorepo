import { initContract } from '@ts-rest/core';
import { z } from 'zod';

// Dashboard overview schema - summary metrics
const dashboardOverviewSchema = z.object({
  date: z.date(),
  totalUser: z.number(),
  paidUser: z.number(),
  avgRevenue: z.number(),
  totalBlog: z.number(),
});

// User metrics schema - for user growth trends
const dashboardUserMetricsSchema = z.array(
  z.object({
    date: z.date(),
    totalUser: z.number(),
    newUsers: z.number(),
    paidUsers: z.number(),
  }),
);

// User demographics schema
const userDemographicsSchema = z.object({
  provinces: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
    }),
  ),
  membershipDistribution: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
    }),
  ),
  userStatus: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
    }),
  ),
});

// Revenue metrics schema - for revenue trends
const dashboardRevenueMetricsSchema = z.array(
  z.object({
    date: z.date(),
    totalRevenue: z.number(),
    avgRevenue: z.number(),
    currency: z.string(),
  }),
);

// Payment analytics schema
const paymentAnalyticsSchema = z.object({
  paymentMethods: z.array(
    z.object({
      method: z.string(),
      count: z.number(),
      total: z.number(),
    }),
  ),
  membershipRevenue: z.array(
    z.object({
      membership: z.string(),
      count: z.number(),
      total: z.number(),
    }),
  ),
  paymentStatus: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
    }),
  ),
});

// Content metrics schema - for blog/content tracking
const contentMetricsSchema = z.object({
  blogStatistics: z.object({
    total: z.number(),
    newToday: z.number(),
    newThisWeek: z.number(),
    newThisMonth: z.number(),
  }),
  categoryDistribution: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
    }),
  ),
  tagDistribution: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
    }),
  ),
  topBlogs: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      views: z.number(),
    }),
  ),
});

// Health metrics data schema
const healthMetricsDataSchema = z.object({
  metrics: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
      isRequired: z.boolean(),
    }),
  ),
  mostTrackedMetrics: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
    }),
  ),
});

// Community engagement schema
const communityEngagementSchema = z.object({
  postsStatistics: z.object({
    total: z.number(),
    newToday: z.number(),
    newThisWeek: z.number(),
  }),
  commentsStatistics: z.object({
    total: z.number(),
    newToday: z.number(),
    newThisWeek: z.number(),
  }),
  activeUsers: z.array(
    z.object({
      user_id: z.string(),
      name: z.string(),
      postCount: z.number(),
      commentCount: z.number(),
    }),
  ),
});

// Error response schema
const errorResponseSchema = z.object({
  message: z.string(),
});

// Export types for use in components
export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;
export type DashboardUserMetrics = z.infer<typeof dashboardUserMetricsSchema>;
export type UserDemographics = z.infer<typeof userDemographicsSchema>;
export type DashboardRevenueMetrics = z.infer<typeof dashboardRevenueMetricsSchema>;
export type PaymentAnalytics = z.infer<typeof paymentAnalyticsSchema>;
export type ContentMetrics = z.infer<typeof contentMetricsSchema>;
export type HealthMetricsData = z.infer<typeof healthMetricsDataSchema>;
export type CommunityEngagement = z.infer<typeof communityEngagementSchema>;

const c = initContract();

export const dashboardContract = c.router({
  // Overview endpoint
  getDashboardOverview: {
    method: 'GET',
    path: '/admin/dashboard/overview',
    description: 'Get summary dashboard data about users, revenue, and blogs',
    responses: {
      200: dashboardOverviewSchema,
      400: errorResponseSchema,
    },
  },

  // // User metrics endpoints
  // getUserMetrics: {
  //   method: 'GET',
  //   path: '/admin/dashboard/users/metrics',
  //   description: 'Get user growth metrics and trends',
  //   query: z.object({
  //     period: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  //     start: z.string().optional(),
  //     end: z.string().optional(),
  //   }),
  //   responses: {
  //     200: dashboardUserMetricsSchema,
  //     400: errorResponseSchema,
  //   },
  // },

  getUserDemographics: {
    method: 'GET',
    path: '/admin/dashboard/users/demographics',
    description: 'Get user demographics data',
    responses: {
      200: userDemographicsSchema,
      400: errorResponseSchema,
    },
  },

  // Revenue metrics endpoints
  getRevenueMetrics: {
    method: 'GET',
    path: '/admin/dashboard/revenue/metrics',
    description: 'Get revenue metrics and trends',
    query: z.object({
      period: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
      start: z.string().optional(),
      end: z.string().optional(),
    }),
    responses: {
      200: dashboardRevenueMetricsSchema,
      400: errorResponseSchema,
    },
  },

  getPaymentAnalytics: {
    method: 'GET',
    path: '/admin/dashboard/revenue/payments',
    description: 'Get payment method and membership revenue analytics',
    responses: {
      200: paymentAnalyticsSchema,
      400: errorResponseSchema,
    },
  },

  // Content metrics endpoints
  getContentMetrics: {
    method: 'GET',
    path: '/admin/dashboard/content',
    description: 'Get blog content metrics and distribution',
    responses: {
      200: contentMetricsSchema,
      400: errorResponseSchema,
    },
  },
});
