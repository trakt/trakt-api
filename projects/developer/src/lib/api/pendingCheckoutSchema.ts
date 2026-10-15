import { z } from 'zod';

export const pendingCheckoutSchema = z.object({
  slot: z.number().int().nonnegative(),
  sessionId: z.string().min(1).nullable(),
});
