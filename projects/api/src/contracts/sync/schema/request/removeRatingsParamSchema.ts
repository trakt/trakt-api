import {
  episodeIdsRequestSchema,
  movieIdsRequestSchema,
  seasonIdsRequestSchema,
  showIdsRequestSchema,
} from '../../../_internal/request/idsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

export const removeRatingsParamSchema = z.object({
  movies: z.array(z.object({ ids: movieIdsRequestSchema })).nullish(),
  shows: z.array(z.object({ ids: showIdsRequestSchema })).nullish(),
  seasons: z.array(z.object({ ids: seasonIdsRequestSchema })).nullish(),
  episodes: z.array(z.object({ ids: episodeIdsRequestSchema })).nullish(),
});
