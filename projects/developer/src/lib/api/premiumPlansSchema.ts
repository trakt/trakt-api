import { z } from 'zod';

export const premiumPlansSchema = z.array(
  z.object({
    plan_code: z.string(),
    name: z.string(),
    duration: z.string(),
    amount: z.number(),
  }),
);
