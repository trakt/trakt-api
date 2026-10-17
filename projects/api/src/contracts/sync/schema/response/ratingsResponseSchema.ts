import { mediaMutationCountsSchema } from '../../../_internal/response/mediaMutationCountsSchema.ts';
import { z } from '../../../_internal/z.ts';
import { ratingsParamSchema } from '../request/ratingsParamSchema.ts';

/** Zod schema for the ratings sync response. */
export const ratingsSyncResponseSchema = z.object({
  added: mediaMutationCountsSchema,
  not_found: ratingsParamSchema,
});
