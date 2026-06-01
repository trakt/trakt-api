import { episodeIdsResponseSchema } from '../../../_internal/response/episodeIdsResponseSchema.ts';
import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

const ratedResponseSchema = z.object({
  rated_at: z.string().datetime(),
  rating: z.number().int().min(1).max(10),
});

const ratedEpisodesResponseSchema = ratedResponseSchema.extend({
  type: z.literal('episode'),
  episode: episodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});

const ratedSeasonResponseSchema = ratedResponseSchema.extend({
  type: z.literal('season'),
  season: z.object({
    number: z.number().int(),
    ids: episodeIdsResponseSchema,
    aired_episodes: z.number().int(),
  }).nullish(),
  show: showResponseSchema.nullish(),
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
  ratedSeasonResponseSchema,
]);
