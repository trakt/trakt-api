import { listSummaryResponseSchema } from './listSummaryResponseSchema.ts';
import { mediaItemsNotFoundSchema } from './mediaItemsNotFoundSchema.ts';
import { z } from '../z.ts';
import { mediaMutationCountsSchema } from './mediaMutationCountsSchema.ts';

/** Zod schema for the list add response. */
export const listAddResponseSchema = z.object({
  added: mediaMutationCountsSchema,
  existing: mediaMutationCountsSchema,
  not_found: mediaItemsNotFoundSchema,
  list: listSummaryResponseSchema,
});
