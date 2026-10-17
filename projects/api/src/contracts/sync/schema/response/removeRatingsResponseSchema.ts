import { mediaMutationCountsSchema } from '../../../_internal/response/mediaMutationCountsSchema.ts';
import { z } from '../../../_internal/z.ts';
import { ratingsParamSchema } from '../request/ratingsParamSchema.ts';

/** Zod schema for the remove ratings response. */
export const removeRatingsResponseSchema = z.object({
  deleted: mediaMutationCountsSchema,
  not_found: ratingsParamSchema,
});
