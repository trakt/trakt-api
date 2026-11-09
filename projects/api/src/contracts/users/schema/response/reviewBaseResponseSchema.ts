import { typedEpisodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import {
  movieResponseSchema,
  typedMovieResponseSchema,
} from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

// A total plus its average per elapsed year, month, week and day of the window.
const statsSchema = z.object({
  total: z.number(),
  yearly: z.number(),
  monthly: z.number(),
  weekly: z.number(),
  daily: z.number(),
});

const statsCategoriesSchema = z.object({
  minutes: statsSchema,
  play_counts: statsSchema,
  collected_counts: statsSchema,
  ratings_counts: statsSchema,
  comments_counts: statsSchema,
});

/** Zod schema for the review stats across shows and movies. */
export const reviewAllStatsSchema = statsCategoriesSchema.extend({
  lists_counts: statsSchema,
});

/**
 * Zod schema for the review play distributions every window returns.
 * Play counts per slot: one per ISO week of the last year, per calendar month, per weekday (starting on the user's week start day) and per hour.
 */
export const reviewDistributionsSchema = z.object({
  weekly: z.number().int().array(),
  monthly: z.number().int().array(),
  days: z.number().int().array(),
  hourly: z.number().int().array(),
});

/** Zod schema for one media type's review stats. */
export const reviewTypeStatsSchema = statsCategoriesSchema.extend({
  items_count: z.number().int(),
  distributions: reviewDistributionsSchema,
});

const watchedEpisodeSchema = z
  .object({
    watched_at: z.string().datetime(),
  })
  .merge(typedEpisodeResponseSchema);

const watchedMovieSchema = z
  .object({
    watched_at: z.string().datetime(),
  })
  .merge(typedMovieResponseSchema);

/** Zod schema for a review first or last watched item. */
export const reviewWatchedItemSchema = z.discriminatedUnion('type', [
  watchedEpisodeSchema,
  watchedMovieSchema,
]);

/**
 * Zod schema for the review most watched titles.
 * most_watched: top 10 titles by minutes, then plays.
 */
export const reviewMostWatchedSchema = z.object({
  shows: z
    .object({
      plays: z.number().int(),
      minutes: z.number().int(),
      show: showResponseSchema,
    })
    .array(),
  movies: z
    .object({
      plays: z.number().int(),
      minutes: z.number().int(),
      movie: movieResponseSchema,
    })
    .array(),
});

/**
 * Zod schema for the review genre counts of one media type.
 * genres: watched titles per genre, sorted by count desc. `item_count` sums the genre counts, so a title with two genres counts twice.
 */
export const reviewGenreCountSchema = z.object({
  item_count: z.number().int(),
  genres: z
    .object({
      slug: z.string().nullable(),
      name: z.string().nullable(),
      count: z.number().int(),
    })
    .array(),
});

/**
 * Zod schema for a review network or production company.
 * networks (shows) and production_companies (movies): top 50 by watched titles. `color` is a hex brand color.
 */
export const reviewCompanySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  count: z.number().int(),
  image_url: z.string().nullable(),
  color: z.string(),
});

/**
 * Zod schema for the review country counts of one media type.
 * countries: watched shows/movies grouped by production country, sorted by count desc.
 */
export const reviewCountryCountSchema = z.object({
  country_count: z.number().int(),
  countries: z
    .object({
      country: z.string(),
      count: z.number().int(),
    })
    .array(),
});

/**
 * Zod schema for the review top rated titles.
 * top_rated: up to 10 titles rated 7 or higher inside the window, highest first.
 */
export const reviewTopRatedSchema = z.object({
  shows: z
    .object({ rating: z.number().int(), show: showResponseSchema })
    .array(),
  movies: z
    .object({ rating: z.number().int(), movie: movieResponseSchema })
    .array(),
});

// trends: most-watched titles premiering each month. `watchers` is the global
// play count, `watched` is whether this user watched it.
const trendShowSchema = z.object({
  month: z.number().int(),
  month_name: z.string(),
  watchers: z.number().int(),
  watched: z.boolean(),
  show: showResponseSchema,
});

const trendMovieSchema = z.object({
  month: z.number().int(),
  month_name: z.string(),
  watchers: z.number().int(),
  watched: z.boolean(),
  movie: movieResponseSchema,
});

/**
 * Zod schema for the review thanks titles.
 * thanks: popular titles the user hasn't watched yet.
 */
export const reviewThanksSchema = z.object({
  shows: z.object({ show: showResponseSchema }).array(),
  movies: z.object({ movie: movieResponseSchema }).array(),
});

/** Zod schema for the keys every review window returns. */
export const reviewBaseResponseSchema = z.object({
  first_watched: reviewWatchedItemSchema.nullable(),
  last_watched: reviewWatchedItemSchema.nullable(),
  most_watched: reviewMostWatchedSchema,
  genres: z.object({
    shows: reviewGenreCountSchema,
    movies: reviewGenreCountSchema,
  }),
  networks: reviewCompanySchema.array(),
  production_companies: reviewCompanySchema.array(),
  countries: z.object({
    shows: reviewCountryCountSchema,
    movies: reviewCountryCountSchema,
  }),
  top_rated: reviewTopRatedSchema,
  trends: z.object({
    shows: trendShowSchema.array(),
    movies: trendMovieSchema.array(),
  }),
  thanks: reviewThanksSchema,
});
