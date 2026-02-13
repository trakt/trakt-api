import { z } from '../../../_internal/z.ts';
import { movieTrendingResponseSchema } from '../../../movies/index.ts';
import { showTrendingResponseSchema } from '../../../shows/index.ts';

export const mediaTrendingResponseSchema = z.union([
  movieTrendingResponseSchema,
  showTrendingResponseSchema,
]);
