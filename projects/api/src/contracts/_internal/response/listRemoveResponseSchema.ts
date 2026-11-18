import { listSummaryResponseSchema } from './listSummaryResponseSchema.ts';
import { mediaItemsNotFoundSchema } from './mediaItemsNotFoundSchema.ts';
import { z } from '../z.ts';
import { mediaMutationCountsSchema } from './mediaMutationCountsSchema.ts';

/** Zod schema for the list remove response. */
export const listRemoveResponseSchema = z.object({
  deleted: mediaMutationCountsSchema,
  not_found: mediaItemsNotFoundSchema,
  list: listSummaryResponseSchema,
});
