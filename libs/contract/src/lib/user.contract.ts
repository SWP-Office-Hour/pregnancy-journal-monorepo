import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { statusSchema, userRoleSchema, userStatusEnumSchema } from './enum.contract';
import { tagResSchema } from './tag.contract';

const c = initContract();

// Schemas
const registerSchema = z
  .object({
    fullname: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

const tokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

const refreshTokenReqSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

// Response schemas
const authResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
  }),
});

const messageResponseSchema = z.object({
  message: z.string(),
});

// Types
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type TokenRequest = z.infer<typeof tokenSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenReqSchema>;

//User

//User zod schema
const userResSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  created_at: z.date(),
  role: userRoleSchema,
  status: userStatusEnumSchema,
  tags: z.array(tagResSchema),
});

//User get all zod schema
const userGetAllResSchema = z.array(userResSchema);

// Contract
export const authContract = c.router({
  register: {
    method: 'POST',
    path: '/users/auth/register',
    body: registerSchema,
    responses: {
      200: authResponseSchema,
      400: messageResponseSchema,
      401: messageResponseSchema,
    },
  },
  login: {
    method: 'POST',
    path: '/users/auth/login',
    body: loginSchema,
    responses: {
      200: authResponseSchema,
      401: messageResponseSchema,
    },
  },
  logout: {
    method: 'POST',
    path: '/users/auth/logout',
    body: tokenSchema,
    responses: {
      200: messageResponseSchema,
      401: messageResponseSchema,
    },
  },
  refreshToken: {
    method: 'POST',
    path: '/users/auth/refresh',
    body: tokenSchema,
    responses: {
      200: authResponseSchema,
      401: messageResponseSchema,
    },
  },
});

export const userContract = c.router({});
