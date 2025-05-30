import {
  movieIdsRequestSchema,
} from '../../../_internal/request/idsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

export const favoriteParamSchema = z.object({
  movies: z.array(
    z.object({ ids: movieIdsRequestSchema }),
  ).nullish(),
});
