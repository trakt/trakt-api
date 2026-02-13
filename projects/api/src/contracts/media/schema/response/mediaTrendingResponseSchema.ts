import { z } from '../../../_internal/z.ts';
import { movieResponseSchema } from '../../../movies/index.ts';
import { showResponseSchema } from '../../../shows/index.ts';

export const mediaTrendingResponseSchema = z.object({
  watchers: z.number().int(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
