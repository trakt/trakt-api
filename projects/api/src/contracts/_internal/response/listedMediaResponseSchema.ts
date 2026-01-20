import { z } from 'zod';
import { seasonResponseSchema } from '../../shows/index.ts';
import { episodeResponseSchema } from './episodeResponseSchema.ts';
import { listMetadataResponseSchema } from './listMetadataResponseSchema.ts';
import { movieResponseSchema } from './movieResponseSchema.ts';
import { showResponseSchema } from './showResponseSchema.ts';

const listedShowSchema = listMetadataResponseSchema
  .merge(z.object({
    type: z.literal('show'),
    show: showResponseSchema.nullish(),
  }));

const listedMovieSchema = listMetadataResponseSchema
  .merge(z.object({
    type: z.literal('movie'),
    movie: movieResponseSchema.nullish(),
  }));

const listedSeasonSchema = listMetadataResponseSchema
  .merge(z.object({
    type: z.literal('season'),
    season: seasonResponseSchema.nullish(),
    show: showResponseSchema.nullish(),
  }));

const listedEpisodeSchema = listMetadataResponseSchema
  .merge(z.object({
    type: z.literal('episode'),
    episode: episodeResponseSchema.nullish(),
    show: showResponseSchema.nullish(),
  }));

export const listedMediaResponseSchema = z.union([
  listedMovieSchema,
  listedShowSchema,
]);

export const listedAllResponseSchema = z.union([
  listedMovieSchema,
  listedShowSchema,
  listedSeasonSchema,
  listedEpisodeSchema,
]);
