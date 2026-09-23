import { z } from 'zod';

export const developerProfileSchema = z.object({
  github: z
    .object({
      id: z.number(),
      username: z.string(),
      linked_at: z.string().nullish(),
    })
    .nullable(),
  applications: z.object({
    count: z.number(),
    limit: z.number(),
  }),
});
