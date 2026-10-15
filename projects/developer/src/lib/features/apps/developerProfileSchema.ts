import { z } from 'zod';
import { developerSubscriptionSchema } from '$lib/features/premium/developerSubscriptionSchema.ts';
import { developerTierSchema } from '$lib/features/premium/developerTierSchema.ts';

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
  tier: developerTierSchema.nullish(),
  subscription: developerSubscriptionSchema.nullish(),
});
