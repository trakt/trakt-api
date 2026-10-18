import { listSummaryResponseSchema } from '../../../_internal/response/listSummaryResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { favoriteParamSchema } from '../request/favoritesParamSchema.ts';

/** Zod schema for the favorites remove response. */
export const favoritesRemoveResponseSchema = z.object({
  deleted: z
    .object({
      movies: z.number().int(),
      shows: z.number().int(),
    })
    .nullish(),
  not_found: favoriteParamSchema,
  list: listSummaryResponseSchema,
});
