import { z } from '../../../_internal/z.ts';
import { movieResponseSchema } from '../../../movies/index.ts';
import { showResponseSchema } from '../../../shows/index.ts';

export const mediaAnticipatedResponseSchema = z.object({
  list_count: z.number().int(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
