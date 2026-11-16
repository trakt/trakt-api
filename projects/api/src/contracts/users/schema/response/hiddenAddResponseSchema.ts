import { z } from '../../../_internal/z.ts';
import { hiddenItemsNotFoundSchema } from './hiddenItemsNotFoundSchema.ts';

/** Zod schema for the hidden add response. */
export const hiddenAddResponseSchema = z.object({
  added: z.object({
    movies: z.number().int(),
    shows: z.number().int(),
    seasons: z.number().int(),
    users: z.number().int(),
  }),
  not_found: hiddenItemsNotFoundSchema,
});
