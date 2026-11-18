import { z } from '../../../_internal/z.ts';
import {
  ratingsParamSchema,
  showRatingSchema,
} from '../request/ratingsParamSchema.ts';

/**
 * Zod schema for the items a ratings write did not find. A season or episode missing
 * under a show echoes that show once per miss, holding only that season or
 * episode.
 */
export const ratingsNotFoundSchema = ratingsParamSchema.extend({
  seasons: z.array(showRatingSchema).nullish(),
  episodes: z.array(showRatingSchema).nullish(),
});
