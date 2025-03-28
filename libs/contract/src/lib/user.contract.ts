import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { childSchema } from './child.contract';
import { userRoleSchema, userStatusEnumSchema } from './enum.contract';

const c = initContract();

//User
//User response
//User zod schema

// Base user schema (common fields)
export const baseUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  address: z.string(),
  role: userRoleSchema,
  status: userStatusEnumSchema,
  membership_id: z.string().optional(),
});

// User response schema
export const userResponseSchema = baseUserSchema.extend({
  user_id: z.string(),
  created_at: z.date(),
});

// User create request schema
const userCreateRequestSchema = userResponseSchema
  .extend({
    password: z.string(), // Add password field
  })
  .omit({ user_id: true, created_at: true }); // Omit fields not needed for creation

// User update request schema
const userUpdateRequestSchema = baseUserSchema
  .partial()
  .extend({
    password: z.string().optional(), // Add password field and make it optional
    user_id: z.string().optional(), // Add user_id field
  })
  .omit({ status: true, role: true });
// Make all fields optional for updates

//user profile
const userProfileSchema = userResponseSchema.omit({ status: true, created_at: true, role: true, user_id: true }).extend({
  child: z.array(childSchema),
  membership_buy_date: z.date().optional(),
  membership_expire_date: z.date().optional().nullable(),
});

//user profile update
const userProfileUpdateSchema = userProfileSchema
  .omit({
    child: true,
    membership_id: true,
    email: true,
  })
  .partial();

const userIncludeMembershipSchema = userResponseSchema.extend({ membership_id: z.string().optional() });

export type UserTypeFromContract = z.infer<typeof userResponseSchema>;
export type UserCreateRequestType = z.infer<typeof userCreateRequestSchema>;
export type UserUpdateRequestType = z.infer<typeof userUpdateRequestSchema>;
export type UserResponseType = z.infer<typeof userResponseSchema>;
export type UserProfileResponseType = z.infer<typeof userProfileSchema>;
export type UserProfileUpdateType = z.infer<typeof userProfileUpdateSchema>;
export type UserIncludeMembershipType = z.infer<typeof userIncludeMembershipSchema>;

export const userContract = c.router({
  getAll: {
    method: 'GET',
    path: '/users',
    description: 'Get all users (đã xong)',
    responses: {
      200: z.array(userIncludeMembershipSchema),
      // 404: object({ message: string() }),
    },
  },

  create: {
    method: 'POST',
    path: '/users',
    body: userCreateRequestSchema,
    description: 'Create a new user (đã xong)',
    responses: {
      200: userResponseSchema,
      // 404: object({ message: string() }),
    },
  },
  update: {
    method: 'PATCH',
    path: '/users',
    body: userUpdateRequestSchema,
    description: 'Update a user (đã xong)',
    responses: {
      200: userResponseSchema,
      404: z.object({ message: z.string() }),
    },
  },

  getProfile: {
    method: 'GET',
    path: '/users/profile',
    description: 'Get user profile',
    responses: {
      200: userProfileSchema,
    },
  },

  updateProfile: {
    method: 'PATCH',
    path: '/users/profile',
    body: userProfileUpdateSchema,
    description: 'Update user profile',
    responses: {
      200: userProfileSchema,
      404: z.object({ message: z.string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/users/:id',
    description: 'Get a user by id (đã xong)',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: userResponseSchema,
      404: z.object({ message: z.string() }),
    },
  },

  delete: {
    method: 'DELETE',
    path: '/users/:id',
    description: '!!! NGUY HIỂM !!! Delete a user by id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
  },
});
