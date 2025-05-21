import { z } from '../z.ts';
import { profileResponseSchema } from './profileResponseSchema.ts';

export const likeResponseSchema = z.object({
  liked_at: z.string().datetime(),
  user: profileResponseSchema,
});
