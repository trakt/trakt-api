import { mediaMutationCountsSchema } from '../../../_internal/response/mediaMutationCountsSchema.ts';
import { z } from '../../../_internal/z.ts';
import { ratingsNotFoundSchema } from './ratingsNotFoundSchema.ts';

/** Zod schema for the ratings sync response. */
export const ratingsSyncResponseSchema = z.object({
  added: mediaMutationCountsSchema,
  /** Items echoed as sent. A season or episode missing under a show echoes that show once per miss, holding only that season or episode. */
  not_found: ratingsNotFoundSchema,
});
