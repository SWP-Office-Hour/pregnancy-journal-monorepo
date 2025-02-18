import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const ReactionSchema = z.object({
  reaction_id: z.string(),
  user_id: z.string(),
  post_id: z.string(),
});

export const ReactionCreateRequestSchema = ReactionSchema.omit({ reaction_id: true });

const c = initContract();
