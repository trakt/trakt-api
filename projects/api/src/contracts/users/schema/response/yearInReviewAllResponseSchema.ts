import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import {
  reviewAllStatsSchema,
  reviewBaseResponseSchema,
  reviewDistributionsSchema,
  reviewTypeStatsSchema,
} from './reviewBaseResponseSchema.ts';
import { yearReviewImagesSchema } from './yearInReviewResponseSchema.ts';

const countSchema = z.number().int();

// yearly: plays per calendar year from the first year watched.
// ratings_distribution: ratings per star, 1 to 10.
const allTimeTypeStatsSchema = reviewTypeStatsSchema.extend({
  distributions: reviewDistributionsSchema.extend({
    yearly: z.object({ year: z.number().int(), count: countSchema }).array(),
  }),
  ratings_distribution: z
    .object({ rating: z.number().int(), count: countSchema })
    .array(),
});

/**
 * Zod schema for the all-time review release years of one media type.
 * release_years: watched titles per release year (every year from the oldest to the newest) and per decade.
 */
export const reviewReleaseYearsSchema = z.object({
  years: z.object({ year: z.number().int(), count: countSchema }).array(),
  decades: z.object({ decade: z.number().int(), count: countSchema }).array(),
});

/**
 * Zod schema for the all-time review progress through one curated list.
 * list_progress: how much of each curated top list the user has watched.
 */
export const reviewListProgressSchema = z.object({
  id: z.number().int(),
  site: z.string(),
  title: z.string(),
  logo: z.string().nullable(),
  total: countSchema,
  watched: countSchema,
  percentage: z.number().int(),
});

/**
 * Zod schema for the all-time review most played titles on Trakt.
 * global_top: the most played titles on Trakt. `watchers` is the global play count, `watched` is whether this user watched it.
 */
export const reviewGlobalTopSchema = z.object({
  shows: z
    .object({
      watchers: countSchema,
      watched: z.boolean(),
      show: showResponseSchema,
    })
    .array(),
  movies: z
    .object({
      watchers: countSchema,
      watched: z.boolean(),
      movie: movieResponseSchema,
    })
    .array(),
});

/** Zod schema for the all-time year in review response. */
export const yearInReviewAllResponseSchema = reviewBaseResponseSchema.extend({
  stats: z.object({
    all: reviewAllStatsSchema,
    shows: allTimeTypeStatsSchema,
    movies: allTimeTypeStatsSchema,
  }),
  images: yearReviewImagesSchema,
  release_years: z.object({
    shows: reviewReleaseYearsSchema,
    movies: reviewReleaseYearsSchema,
  }),
  list_progress: z.object({
    shows: reviewListProgressSchema.array(),
    movies: reviewListProgressSchema.array(),
  }),
  global_top: reviewGlobalTopSchema,
});
