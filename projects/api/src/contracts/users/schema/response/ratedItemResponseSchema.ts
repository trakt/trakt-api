import { episodeIdsResponseSchema } from '../../../_internal/response/episodeIdsResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showIdsResponseSchema } from '../../../_internal/response/showIdsResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

const ratedResponseSchema = z.object({
  rated_at: z.string().datetime(),
  rating: z.number().int().min(1).max(10),
});

const ratedEpisodesResponseSchema = ratedResponseSchema.extend({
  type: z.literal('episode'),
  episode: z.object({
    season: z.number().int(),
    number: z.number().int(),
    title: z.string().nullish(),
    ids: episodeIdsResponseSchema,
  }).nullish(),
  show: z.object({
    title: z.string(),
    year: z.number().int().nullish(),
    aired_episodes: z.number().int(),
    ids: showIdsResponseSchema,
  }).nullish(),
});

const ratedMoviesResponseSchema = ratedResponseSchema
  .merge(z.object({
    type: z.literal('movie'),
    movie: movieResponseSchema.nullish(),
  }));

const ratedShowsResponseSchema = ratedResponseSchema
  .merge(z.object({
    type: z.literal('show'),
    show: showResponseSchema.nullish(),
  }));

export const RatedItemResponseSchema = z.union([
  ratedEpisodesResponseSchema,
  ratedMoviesResponseSchema,
  ratedShowsResponseSchema,
]);
