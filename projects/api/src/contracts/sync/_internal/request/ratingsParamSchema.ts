import {
  episodeIdsRequestSchema,
  movieIdsRequestSchema,
  seasonIdsRequestSchema,
  showIdsRequestSchema,
} from '../../../_internal/request/idsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

export const mediaRatingSchema = z.object({
  rating: z.number().int().min(1).max(10),
});

export const ratingsParamSchema = z.object({
  movies: z.array(
    mediaRatingSchema
      .merge(z.object({ ids: movieIdsRequestSchema })),
  ).nullish(),
  shows: z.array(
    mediaRatingSchema
      .merge(z.object({ ids: showIdsRequestSchema })),
  ).nullish(),
  seasons: z.array(
    mediaRatingSchema
      .merge(z.object({ ids: seasonIdsRequestSchema })),
  ).nullish(),
  episodes: z.array(
    mediaRatingSchema
      .merge(z.object({ ids: episodeIdsRequestSchema })),
  ).nullish(),
});
