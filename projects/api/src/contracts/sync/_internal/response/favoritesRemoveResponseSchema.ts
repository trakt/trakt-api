import { z } from '../../../_internal/z.ts';
import { favoriteParamSchema } from '../request/favoritesParamSchema.ts';

export const favoritesRemoveResponseSchema = z.object({
  deleted: z.object({
    movies: z.number().int(),
    shows: z.number().int(),
  }).optional(),
  not_found: favoriteParamSchema,
  list: z.object({
    updated_at: z.string().datetime(),
    item_count: z.number().int(),
  }),
});
