import { z } from '../../../_internal/z.ts';

/** Zod schema for the avatar request. */
export const avatarRequestSchema = z.object({
  user: z.object({
    avatar: z.string(),
  }),
});
