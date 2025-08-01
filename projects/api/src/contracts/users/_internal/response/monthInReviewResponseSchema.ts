import { typedEpisodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
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

export const monthInReviewResponseSchema = z.object({
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
});
