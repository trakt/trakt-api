import { z } from '../../../_internal/z.ts';
import { hiddenItemsNotFoundSchema } from './hiddenItemsNotFoundSchema.ts';

/** Zod schema for the hidden remove response. */
export const hiddenRemoveResponseSchema = z.object({
  deleted: z.object({
    movies: z.number().int(),
    shows: z.number().int(),
    seasons: z.number().int(),
    users: z.number().int(),
  }),
  not_found: hiddenItemsNotFoundSchema,
});
