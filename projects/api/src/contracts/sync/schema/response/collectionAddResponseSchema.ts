import { z } from '../../../_internal/z.ts';
import { collectionAddRequestSchema } from '../request/collectionAddRequestSchema.ts';

const collectedCountsSchema = z.object({
  movies: z.number().int(),
  episodes: z.number().int(),
});

/** Zod schema for the collection add response. */
export const collectionAddResponseSchema = z.object({
  added: collectedCountsSchema,
  /** Already collected; the date or metadata changed. Metadata left out of the request is cleared. */
  updated: collectedCountsSchema,
  /** Already collected with the same date and metadata. */
  existing: collectedCountsSchema,
  /** Items echoed as sent. A movie or episode without a release date is echoed as `{ ids: { trakt } }`. */
  not_found: collectionAddRequestSchema,
});
