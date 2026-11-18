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
  /**
   * Items not found, echoed as sent. A season or episode missing under a show
   * echoes that show once per miss, holding only the missing season or episode.
   * A movie or episode without a release date is echoed as `{ ids: { trakt } }`.
   */
  not_found: collectionAddRequestSchema.extend({
    seasons: collectionAddRequestSchema.shape.shows,
    episodes: collectionAddRequestSchema.shape.shows,
  }),
});
