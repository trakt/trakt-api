import { z } from 'zod';

export const followingSchema = z.array(
  z.object({
    user: z.object({
      username: z.string(),
      ids: z.object({ slug: z.string() }),
    }),
  }),
);
