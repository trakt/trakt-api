import { z } from '../z.ts';

/** Zod schema for the recent period parameters. */
export const recentPeriodParamsSchema = z.object({
  period: z.enum([
    'daily',
    'weekly',
    'monthly',
  ]),
});
