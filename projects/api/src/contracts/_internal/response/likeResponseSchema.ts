import { z } from '../z.ts';
import { profileResponseSchema } from './userProfileResponseSchema.ts';

export const likeResponseSchema = z.object({
  liked_at: z.string(),
  user: profileResponseSchema,
});
