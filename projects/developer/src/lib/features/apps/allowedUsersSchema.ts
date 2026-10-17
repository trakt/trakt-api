import { z } from 'zod';

export const allowedUsersSchema = z.object({
  limit: z.number(),
  users: z.array(
    z.object({
      user: z.object({
        username: z.string(),
        ids: z.object({ slug: z.string() }),
      }),
      added_at: z.string(),
    }),
  ),
});
