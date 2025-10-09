import { z } from '../../../_internal/z.ts';

export const progressParamsSchema = z.object({
  start_at: z.string().optional().openapi({
    description: 'Start date for the range. Must be formatted as "YYYY-MM-DD".',
  }),
  end_at: z.string().optional().openapi({
    description: 'End date for the range. Must be formatted as "YYYY-MM-DD".',
  }),
});
