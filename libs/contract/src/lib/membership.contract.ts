import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import {statusSchema, membershipDaySchema} from './enum.contract';


const membershipResContract = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  createAt: z.date(),
  status: statusSchema,
  expiredInDay: membershipDaySchema,
});

const membershipGetAllResContract = z.array(membershipResContract);
