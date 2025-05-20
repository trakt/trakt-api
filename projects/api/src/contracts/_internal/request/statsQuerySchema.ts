import { z } from '../z.ts';

export const statsQuerySchema = z.object({
  include_stats: z.boolean().optional().openapi({
    description: 'Whether to include stats in the response',
  }),
});
