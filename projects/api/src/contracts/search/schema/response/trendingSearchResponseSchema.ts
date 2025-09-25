import { z } from '../../../_internal/z.ts';
import { trendingSearchMovieResponseSchema } from './trendingSearchMovieResponseSchema.ts';
import { trendingSearchPersonResponseSchema } from './trendingSearchPersonResponseSchema.ts';
import { trendingSearchShowResponseSchema } from './trendingSearchShowResponseSchema.ts';

export const trendingSearchResponseSchema = z.union([
  trendingSearchMovieResponseSchema,
  trendingSearchShowResponseSchema,
  trendingSearchPersonResponseSchema,
]);
