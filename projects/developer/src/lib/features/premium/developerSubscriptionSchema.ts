import { z } from 'zod';

export const developerSubscriptionSchema = z.object({
  status: z.enum(['active', 'cancelled']),
  gateway: z.string(),
  started_at: z.string(),
  renews_at: z.string(),
});
