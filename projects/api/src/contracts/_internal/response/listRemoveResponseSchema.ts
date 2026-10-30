import { listSummaryResponseSchema } from './listSummaryResponseSchema.ts';
import { mediaItemsRequestSchema } from '../request/mediaItemsRequestSchema.ts';
import { z } from '../z.ts';
import { mediaMutationCountsSchema } from './mediaMutationCountsSchema.ts';

/** Zod schema for the list remove response. */
export const listRemoveResponseSchema = z.object({
  deleted: mediaMutationCountsSchema,
  not_found: mediaItemsRequestSchema,
  list: listSummaryResponseSchema,
});
