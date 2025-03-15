import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const ReactionSchema = z.object({
  reaction_id: z.string(),
  user_id: z.string(),
  post_id: z.string(),
});

export const ReactionRequestSchema = ReactionSchema.omit({ reaction_id: true, user_id: true });

export type ReactionResponseType = z.infer<typeof ReactionSchema>;
export type ReactionRequestType = z.infer<typeof ReactionRequestSchema>;

const c = initContract();

export const reactionContract = c.router({
  createReaction: {
    method: 'POST',
    path: '/reactions',
    description: 'Create a reaction or remove a reaction',
    body: ReactionRequestSchema,
    responses: {
      200: ReactionSchema,
      201: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
  },
  getReactionByPostId: {
    method: 'GET',
    path: '/reactions/:post_id',
    description: 'Get all reactions by post id',
    pathParams: z.object({
      post_id: z.string(),
    }),
    responses: {
      200: z.object({
        total_reactions: z.number(),
        reactions: z.array(ReactionSchema),
      }),
    },
  },
});
