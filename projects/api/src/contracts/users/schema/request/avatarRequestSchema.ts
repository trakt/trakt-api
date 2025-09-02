import { z } from '../../../_internal/z.ts';

export const avatarRequestSchema = z.object({
  user: z.object({
    avatar: z.string(),
  }),
});
