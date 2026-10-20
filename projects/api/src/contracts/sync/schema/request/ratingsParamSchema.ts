import {
  episodeIdsRequestSchema,
  movieIdsRequestSchema,
  seasonIdsRequestSchema,
  showIdsRequestSchema,
} from '../../../_internal/request/idsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

const ratingSchema = z.number().int().min(1).max(10);

/** Zod schema for media rating. */
export const mediaRatingSchema = z.object({
  rating: ratingSchema,
  /** UTC datetime the item was rated; defaults to now. */
  rated_at: z.string().datetime().nullish(),
});

/** A season rated through its show. With `episodes`, only those episodes are rated. */
const showSeasonRatingSchema = mediaRatingSchema.extend({
  number: z.number().int(),
  rating: ratingSchema.nullish(),
  episodes: z
    .array(mediaRatingSchema.extend({ number: z.number().int() }))
    .nullish(),
});

/** Zod schema for ratings param. */
export const ratingsParamSchema = z.object({
  movies: z
    .array(mediaRatingSchema.merge(z.object({ ids: movieIdsRequestSchema })))
    .nullish(),
  shows: z
    .array(
      mediaRatingSchema.extend({
        ids: showIdsRequestSchema,
        /** Required unless `seasons` is sent. */
        rating: ratingSchema.nullish(),
        /** Rates these seasons or episodes instead of the show. */
        seasons: z.array(showSeasonRatingSchema).nullish(),
      }),
    )
    .nullish(),
  seasons: z
    .array(mediaRatingSchema.merge(z.object({ ids: seasonIdsRequestSchema })))
    .nullish(),
  episodes: z
    .array(mediaRatingSchema.merge(z.object({ ids: episodeIdsRequestSchema })))
    .nullish(),
});
