import { z } from 'zod';

export const managersSchema = z.object({
  managers: z.array(
    z.object({
      user: z.object({
        username: z.string(),
        ids: z.object({ slug: z.string() }),
      }),
      added_at: z.string(),
    }),
  ),
});
