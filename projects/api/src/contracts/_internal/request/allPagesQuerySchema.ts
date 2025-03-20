import { z } from '../z.ts';

export const allPagesQuerySchema = z.object({
  limit: z.literal('all').optional(),
});
