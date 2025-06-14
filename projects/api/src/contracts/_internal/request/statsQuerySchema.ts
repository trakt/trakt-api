import { z } from '../z.ts';

export const statsQuerySchema = z.object({
  include_stats: z.boolean().nullish().openapi({
    description: 'Whether to include stats in the response',
  }),
});
