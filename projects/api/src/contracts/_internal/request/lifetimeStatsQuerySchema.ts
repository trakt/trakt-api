import { z } from '../z.ts';

export const lifetimeStatsQuerySchema = z.object({
  lifetime_stats: z.boolean().optional().openapi({
    description:
      'When true, `progress.completed` and `progress.stats` reflect lifetime totals across all watches of the show. When false (default), they reflect the current watching session — i.e. counters reset by `/shows/:id/progress/watched/reset`.',
  }),
});
