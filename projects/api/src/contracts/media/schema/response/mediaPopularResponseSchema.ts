import { z } from '../../../_internal/z.ts';
import { movieResponseSchema } from '../../../movies/index.ts';
import { showResponseSchema } from '../../../shows/index.ts';

export const mediaPopularResponseSchema = z.union([
  movieResponseSchema,
  showResponseSchema,
]);
