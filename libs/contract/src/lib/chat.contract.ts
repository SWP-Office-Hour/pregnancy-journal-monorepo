import { z } from 'zod';

export const sendMessSchema = z.object({
  username: z.string(),
  message: z.string(),
  timestamp: z.date(),
});

const joinChatSchema = z.object({
  username: z.string(),
});

export type SendMess = z.infer<typeof sendMessSchema>;
export type JoinChat = z.infer<typeof joinChatSchema>;
