import { z } from '../../../_internal/z.ts';

export const coverRequestSchema = z.object({
  cover_type: z.enum(['movie', 'show', 'episode']),
  cover_id: z.number(),
});
