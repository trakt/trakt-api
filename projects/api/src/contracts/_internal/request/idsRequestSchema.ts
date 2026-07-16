import { z } from '../z.ts';

const allMediaIdsSchema = z.object({
  trakt: z.number().int().nullish().openapi({ description: 'Trakt ID' }),
  slug: z.string().nullish().openapi({ description: 'Slug' }),
  imdb: z.string().nullish().openapi({ description: 'IMDb ID' }),
  tmdb: z.number().int().nullish().openapi({ description: 'TMDb ID' }),
  tvdb: z.number().int().nullish().openapi({ description: 'TVDb ID' }),
});

const showMediaIdsSchema = allMediaIdsSchema;

const movieMediaIdsSchema = allMediaIdsSchema
  .omit({
    tvdb: true,
  });

const seasonIdsSchema = allMediaIdsSchema.omit({
  imdb: true,
  slug: true,
});

const episodeIdsSchema = allMediaIdsSchema.omit({
  imdb: true,
  slug: true,
  tmdb: true,
});

/** Zod schema for the show ids request. */
export const showIdsRequestSchema = z.union([
  showMediaIdsSchema.extend({ trakt: z.number().int() }),
  showMediaIdsSchema.extend({ slug: z.string() }),
  showMediaIdsSchema.extend({ imdb: z.string() }),
  showMediaIdsSchema.extend({ tmdb: z.number().int() }),
  showMediaIdsSchema.extend({ tvdb: z.number().int() }),
]);

/** Zod schema for the movie ids request. */
export const movieIdsRequestSchema = z.union([
  movieMediaIdsSchema.extend({ trakt: z.number().int() }),
  movieMediaIdsSchema.extend({ slug: z.string() }),
  movieMediaIdsSchema.extend({ imdb: z.string() }),
  movieMediaIdsSchema.extend({ tmdb: z.number().int() }),
]);

/** Zod schema for the season ids request. */
export const seasonIdsRequestSchema = z.union([
  seasonIdsSchema.extend({ trakt: z.number().int() }),
  seasonIdsSchema.extend({ tmdb: z.string() }),
  seasonIdsSchema.extend({ tvdb: z.number().int() }),
]);

/** Zod schema for the episode ids request. */
export const episodeIdsRequestSchema = z.union([
  episodeIdsSchema.extend({ trakt: z.number().int() }),
  episodeIdsSchema.extend({ tvdb: z.number().int() }),
]);
