import { z } from '../z.ts';
import {
  episodeIdsRequestSchema,
  movieIdsRequestSchema,
  seasonIdsRequestSchema,
  showIdsRequestSchema,
} from './idsRequestSchema.ts';

/** Bulk media items request schema factory, spreading `extras` onto every item level. */
export const mediaItemsRequestSchemaFactory = <T extends z.ZodRawShape>(
  extras: T,
) => {
  const titleAndYear = {
    title: z.string().nullish(),
    year: z.number().int().nullish(),
  };

  const episodeNumber = z.object({ number: z.number().int(), ...extras });

  const seasonNumber = z.object({
    number: z.number().int(),
    episodes: z.array(episodeNumber).nullish(),
    ...extras,
  });

  return z.object({
    movies: z
      .array(
        z.object({
          ids: movieIdsRequestSchema.nullish(),
          ...titleAndYear,
          ...extras,
        }),
      )
      .nullish(),
    shows: z
      .array(
        z.object({
          ids: showIdsRequestSchema.nullish(),
          ...titleAndYear,
          seasons: z.array(seasonNumber).nullish(),
          ...extras,
        }),
      )
      .nullish(),
    seasons: z
      .array(z.object({ ids: seasonIdsRequestSchema, ...extras }))
      .nullish(),
    episodes: z
      .array(z.object({ ids: episodeIdsRequestSchema, ...extras }))
      .nullish(),
  });
};
