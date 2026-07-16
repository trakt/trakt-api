import { z } from '../../../_internal/z.ts';

/** Zod schema for the cover request. */
export const coverRequestSchema = z.object({
  cover_type: z.enum(['movie', 'show', 'episode']),
  cover_id: z.number().int(),
});
