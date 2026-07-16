import { z } from '../z.ts';

/** Zod schema for the period parameters. */
export const periodParamsSchema = z.object({
  period: z.enum([
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'all',
  ]),
});
