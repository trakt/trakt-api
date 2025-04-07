import { z } from '../z.ts';

export const recentPeriodParamsSchema = z.object({
  period: z.enum([
    'daily',
    'weekly',
    'monthly',
  ]),
});
