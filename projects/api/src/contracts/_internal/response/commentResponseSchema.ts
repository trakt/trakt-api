import { z } from '../z.ts';
import { profileResponseSchema } from './profileResponseSchema.ts';

export const commentResponseSchema = z.object({
  id: z.number().int(),
  parent_id: z.number().int(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  comment: z.string(),
  spoiler: z.boolean(),
  review: z.boolean(),
  replies: z.number().int(),
  likes: z.number().int(),
  language: z.string().nullish(),
  user_rating: z.number().int().nullish(),
  user_stats: z.object({
    rating: z.number().int().nullish(),
    play_count: z.number().int(),
    completed_count: z.number().int(),
  }),
  user: profileResponseSchema,
});
