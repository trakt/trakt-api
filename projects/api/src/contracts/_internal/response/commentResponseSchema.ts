import { z } from '../z.ts';
import { profileResponseSchema } from './profileResponseSchema.ts';

export const commentResponseSchema = z.object({
  id: z.number(),
  parent_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  comment: z.string(),
  spoiler: z.boolean(),
  review: z.boolean(),
  replies: z.number(),
  likes: z.number(),
  user_rating: z.number().nullable(),
  user_stats: z.object({
    rating: z.number().nullable(),
    play_count: z.number(),
    completed_count: z.number(),
  }),
  user: profileResponseSchema,
});
