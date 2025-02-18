import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const CommentSchema = z.object({
  comment_id: z.string(),
  content: z.string(),
  post_id: z.string(),
  user_id: z.string(),
  create_at: z.string(),
  update_at: z.string(),
});

export const CommentCreateRequestSchema = CommentSchema.omit({ comment_id: true, update_at: true, user_id: true, create_at: true });
export const CommentUpdateRequestSchema = CommentSchema.omit({ create_at: true, user_id: true, post_id: true, update_at: true });

export type Comment = z.infer<typeof CommentSchema>;
export type CommentCreateRequest = z.infer<typeof CommentCreateRequestSchema>;
export type CommentUpdateRequest = z.infer<typeof CommentUpdateRequestSchema>;

const c = initContract();

export const commentContract = c.router({
  create: {
    method: 'POST',
    path: '/comments',
    description: 'Create a new comment',
    body: CommentCreateRequestSchema,
    responses: {
      200: CommentSchema,
    },
  },
  getAll: {
    method: 'GET',
    path: '/comments/:post_id',
    description: 'Get all comments by post_id',
    pathParams: z.object({
      post_id: z.string(),
    }),
    responses: {
      200: z.array(CommentSchema),
    },
  },
  update: {
    method: 'PATCH',
    path: '/comments',
    description: 'Update a comment',
    body: CommentUpdateRequestSchema,
    responses: {
      200: CommentSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/comments/:comment_id',
    description: 'Delete a comment by comment_id',
    pathParams: z.object({
      comment_id: z.string(),
    }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },
});
