import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { userRoleSchema, userStatusEnumSchema } from './enum.contract';
import { tagResSchema } from './tag.contract';

const c = initContract();

//User
//User response
//User zod schema
const userResSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  expected_birth_date: z.date(),
  membershipId: z.string().optional(),
  phone: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  address: z.string(),
  role: userRoleSchema,
  createAt: z.date(),
  status: userStatusEnumSchema,
});

//User get all zod schema
const userGetAllResSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createAt: z.date(),
    role: userRoleSchema,
    status: userStatusEnumSchema,
    tags: z.array(tagResSchema),
  }),
);

//User request schema
//User create request schema
const userCreateReqSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  expected_birth_date: z.string().datetime(),
  membershipId: z.string().optional(),
  phone: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  address: z.string(),
  role: userRoleSchema,
  status: userStatusEnumSchema,
});

//User update request schema
const userUpdateReqSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
  name: z.string().optional(),
  expectedBirthDate: z.string().datetime().optional(),
  membershipId: z.string().optional(),
  phone: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  address: z.string().optional(),
  role: userRoleSchema.optional(),
  status: userStatusEnumSchema.optional(),
});

export type UserCreateRequest = z.infer<typeof userCreateReqSchema>;
export type UserUpdateRequest = z.infer<typeof userUpdateReqSchema>;

export const userContract = c.router({
  getAll: {
    method: 'GET',
    path: '/users',
    responses: {
      200: userGetAllResSchema,
      // 404: object({ message: string() }),
    },
  },
  getOne: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: userResSchema,
      404: z.object({ message: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/users',
    body: userCreateReqSchema,
    responses: {
      200: userResSchema,
      // 404: object({ message: string() }),
    },
  },
  update: {
    method: 'PATCH',
    path: '/users',
    body: userUpdateReqSchema,
    responses: {
      200: userResSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
