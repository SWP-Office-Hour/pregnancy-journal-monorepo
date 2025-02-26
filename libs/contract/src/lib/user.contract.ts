import { initContract } from '@ts-rest/core';
import { z } from 'zod';
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
});

// User response schema
export const userResSchema = baseUserSchema.extend({
  user_id: z.string(),
  expected_birth_date: z.date(),
  membershipId: z.string().optional(),
  created_at: z.date(),
});

// User create request schema
const userCreateReqSchema = userResSchema
  .extend({
    password: z.string(), // Add password field
    expected_birth_date: z.string().datetime(), // Change expected_birth_date to string
  })
  .omit({ user_id: true, created_at: true }); // Omit fields not needed for creation

// User update request schema
const userUpdateReqSchema = baseUserSchema
  .partial()
  .extend({
    expected_birth_date: z.string().datetime().optional(), // Change expected_birth_date to string and make it optional
    password: z.string().optional(), // Add password field and make it optional
    user_id: z.string().optional(), // Add user_id field
  })
  .omit({ status: true, role: true });
// Make all fields optional for updates

//user profile
const userProfileSchema = userResSchema
  .extend({
    expected_birth_date: z.date(), // Change expected_birth_date to string
  })
  .omit({ status: true, created_at: true, role: true, user_id: true });

//user profile update
const userProfileUpdateSchema = userProfileSchema
  .omit({
    membershipId: true,
    email: true,
  })
  .partial()
  .extend({ expected_birth_date: z.string().datetime().optional() });

export type UserCreateRequestType = z.infer<typeof userCreateReqSchema>;
export type UserUpdateRequestType = z.infer<typeof userUpdateReqSchema>;
export type UserResponseType = z.infer<typeof userResSchema>;
export type UserProfileResponseType = z.infer<typeof userProfileSchema>;
export type UserProfileUpdateType = z.infer<typeof userProfileUpdateSchema>;

export const userContract = c.router({
  getAll: {
    method: 'GET',
    path: '/users',
    description: 'Get all users (đã xong)',
    responses: {
      200: z.array(userResSchema),
      // 404: object({ message: string() }),
    },
  },

  create: {
    method: 'POST',
    path: '/users',
    body: userCreateReqSchema,
    description: 'Create a new user (đã xong)',
    responses: {
      200: userResSchema,
      // 404: object({ message: string() }),
    },
  },
  update: {
    method: 'PATCH',
    path: '/users',
    body: userUpdateReqSchema,
    description: 'Update a user (đã xong)',
    responses: {
      200: userResSchema,
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
      200: userResSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
