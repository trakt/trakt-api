import { z } from '../z.ts';

export const limitlessQuerySchema = z.object({
  limit: z.literal('all').optional(),
});
