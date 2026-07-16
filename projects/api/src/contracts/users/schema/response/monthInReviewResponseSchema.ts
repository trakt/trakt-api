import { typedEpisodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import {
  movieResponseSchema,
  typedMovieResponseSchema,
} from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

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

const watchedEpisodeSchema = z.object({
  watched_at: z.string().datetime(),
}).merge(typedEpisodeResponseSchema);

const watchedMovieSchema = z.object({
  watched_at: z.string().datetime(),
}).merge(typedMovieResponseSchema);

const watchedItemSchema = z.discriminatedUnion('type', [
  watchedEpisodeSchema,
  watchedMovieSchema,
]);

// countries: watched shows/movies grouped by production country, sorted by
// count desc.
const countryCountSchema = z.object({
  country_count: z.number().int(),
  countries: z.object({
    country: z.string(),
    count: z.number().int(),
  }).array(),
});

const countriesSchema = z.object({
  shows: countryCountSchema,
  movies: countryCountSchema,
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

const trendsSchema = z.object({
  shows: trendShowSchema.array(),
  movies: trendMovieSchema.array(),
});

// thanks: popular titles the user hasn't watched yet.
const thanksSchema = z.object({
  shows: z.object({ show: showResponseSchema }).array(),
  movies: z.object({ movie: movieResponseSchema }).array(),
});

// streaming_services: subscription services the user watched on, with per-type
// counts. Month in Review only.
const streamingServicesSchema = z.object({
  country: z.string(),
  services: z.object({
    source: z.string(),
    name: z.string(),
    shows: z.number().int(),
    movies: z.number().int(),
    all: z.number().int(),
  }).array(),
});

// Shared by both the month- and year-in-review endpoints. Year in Review does
// not include `streaming_services` (the catalog scan is bounded to a month).
/** Zod schema for review base. */
export const reviewBaseSchema = z.object({
  stats: z.object({
    all: statsCategoriesSchema.merge(z.object({
      lists_counts: statsSchema,
    })),
    shows: statsCategoriesSchema,
    movies: statsCategoriesSchema,
  }),
  images: z.object({
    cover: z.string(),
    story: z.string(),
  }),
  first_watched: watchedItemSchema.nullable(),
  last_watched: watchedItemSchema.nullable(),
  countries: countriesSchema,
  trends: trendsSchema,
  thanks: thanksSchema,
});

/** Zod schema for the month in review response. */
export const monthInReviewResponseSchema = reviewBaseSchema.merge(z.object({
  streaming_services: streamingServicesSchema,
}));
