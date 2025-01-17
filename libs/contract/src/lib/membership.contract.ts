import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import {statusSchema, membershipDaySchema} from './enum.contract';


const membershipResContract = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  created_at: z.date(),
  status: statusSchema,
  expired_in_day: membershipDaySchema,
});

const membershipGetAllResContract = z.array(membershipResContract);
