import { listSummaryResponseSchema } from '../../../_internal/response/listSummaryResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { favoriteParamSchema } from '../request/favoritesParamSchema.ts';

/** Zod schema for the favorites response. */
export const favoritesResponseSchema = z.object({
  added: z
    .object({
      movies: z.number().int(),
      shows: z.number().int(),
    })
    .nullish(),
  existing: z
    .object({
      movies: z.number().int(),
      shows: z.number().int(),
    })
    .nullish(),
  not_found: favoriteParamSchema,
  list: listSummaryResponseSchema,
});
