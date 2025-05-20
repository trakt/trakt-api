import { z } from '../z.ts';

const allMediaIdsSchema = z.object({
  trakt: z.number().optional().openapi({ description: 'Trakt ID' }),
  slug: z.string().optional().openapi({ description: 'Slug' }),
  imdb: z.string().optional().openapi({ description: 'IMDb ID' }),
  tmdb: z.number().optional().openapi({ description: 'TMDb ID' }),
  tvdb: z.number().optional().openapi({ description: 'TVDb ID' }),
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

export const showIdsRequestSchema = z.union([
  showMediaIdsSchema.extend({ trakt: z.number() }),
  showMediaIdsSchema.extend({ slug: z.string() }),
  showMediaIdsSchema.extend({ imdb: z.string() }),
  showMediaIdsSchema.extend({ tmdb: z.number() }),
  showMediaIdsSchema.extend({ tvdb: z.number() }),
]);

export const movieIdsRequestSchema = z.union([
  movieMediaIdsSchema.extend({ trakt: z.number() }),
  movieMediaIdsSchema.extend({ slug: z.string() }),
  movieMediaIdsSchema.extend({ imdb: z.string() }),
  movieMediaIdsSchema.extend({ tmdb: z.number() }),
]);

export const seasonIdsRequestSchema = z.union([
  seasonIdsSchema.extend({ trakt: z.number() }),
  seasonIdsSchema.extend({ tmdb: z.string() }),
  seasonIdsSchema.extend({ tvdb: z.number() }),
]);

export const episodeIdsRequestSchema = z.union([
  episodeIdsSchema.extend({ trakt: z.number() }),
  episodeIdsSchema.extend({ tvdb: z.number() }),
]);
