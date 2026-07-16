import { z } from '../z.ts';
import { profileResponseSchema } from './profileResponseSchema.ts';

/** Zod schema for the like response. */
export const likeResponseSchema = z.object({
  liked_at: z.string().datetime(),
  user: profileResponseSchema,
});
