import { mediaMutationCountsSchema } from '../../../_internal/response/mediaMutationCountsSchema.ts';
import { z } from '../../../_internal/z.ts';
import {
  ratingsParamSchema,
  showRatingSchema,
} from '../request/ratingsParamSchema.ts';

/** Zod schema for the ratings sync response. */
export const ratingsSyncResponseSchema = z.object({
  added: mediaMutationCountsSchema,
  /** Items echoed as sent. A season or episode missing under a show echoes that show. */
  not_found: ratingsParamSchema.extend({
    seasons: z.array(showRatingSchema).nullish(),
    episodes: z.array(showRatingSchema).nullish(),
  }),
});
