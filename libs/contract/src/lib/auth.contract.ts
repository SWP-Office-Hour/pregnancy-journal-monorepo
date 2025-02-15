import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { userRoleSchema } from './enum.contract';

const c = initContract();

// Types
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type TokenRequest = z.infer<typeof tokenSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenReqSchema>;

// Schemas
const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    password: z.string().regex(
      // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      /[\s\S]*/,
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    ),
    confirm_password: z.string(),
    expected_birth_date: z.string().datetime(),
    phone: z.string().min(1, 'Phone is required'),
    province: z.string().min(1, 'Province is required'),
    district: z.string().min(1, 'District is required'),
    ward: z.string().min(1, 'Ward is required'),
    address: z.string().min(1, 'Address is required'),
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
  // refresh_token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    role: userRoleSchema,
  }),
});

const messageResponseSchema = z.object({
  message: z.string(),
});

// Contract
export const authContract = c.router({
  register: {
    method: 'POST',
    path: '/users/auth/register',
    description: 'Register a new user (đã xong)',
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
    description: 'Login (đã xong)',
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
    description: 'Logout (đã xong)',
    responses: {
      200: messageResponseSchema,
      401: messageResponseSchema,
    },
  },
  // refreshToken: {
  //   method: 'POST',
  //   path: '/users/auth/refresh',
  //   body: tokenSchema,
  //   responses: {
  //     200: authResponseSchema,
  //     401: messageResponseSchema,
  //   },
  // },
});
