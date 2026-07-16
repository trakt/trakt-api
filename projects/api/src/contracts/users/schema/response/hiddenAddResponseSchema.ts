import { bulkMediaRequestSchema } from '../../../_internal/request/bulkMediaRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the hidden add response. */
export const hiddenAddResponseSchema = z.object({
  added: z.object({
    movies: z.number().int(),
    shows: z.number().int(),
    season: z.number().int(),
  }),
  not_found: bulkMediaRequestSchema,
});
