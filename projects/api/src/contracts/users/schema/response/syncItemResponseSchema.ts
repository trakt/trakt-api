import { float, z } from '../../../_internal/z.ts';

const movieVariantSchema = z.object({
  type: z.literal('movie'),
  title: z.string(),
  year: z.number().int(),
  ids: z.object({
    trakt: z.number().int(),
    slug: z.string(),
    imdb: z.string().nullable(),
    tmdb: z.number().int().nullable(),
  }),
});

const showVariantSchema = z.object({
  type: z.literal('show'),
  title: z.string(),
  year: z.number().int(),
  ids: z.object({
    trakt: z.number().int(),
    slug: z.string(),
  }),
});

const episodeVariantSchema = z.object({
  type: z.literal('episode'),
  season: z.number().int(),
  number: z.number().int(),
  title: z.string(),
  ids: z.object({
    trakt: z.number().int(),
    tmdb: z.number().int().nullable(),
  }),
  show: showVariantSchema.nullable(),
});

/** Zod schema for trakt item. */
export const traktItemSchema = z.discriminatedUnion('type', [
  movieVariantSchema,
  showVariantSchema,
  episodeVariantSchema,
]);

/** Zod schema for sync item. */
export const syncItemSchema = z.object({
  kind: z.enum(['history', 'rating']).openapi({
    description:
      'Discriminator. `skipped` mixes `history` and `rating`; `paused` is always `history`.',
  }),
  type: z.enum(['movie', 'episode', 'show']).nullable().openapi({
    description:
      'Resolved media type, or null when it could not be derived from the available ids.',
  }),
  trakt_item: traktItemSchema.nullable().openapi({
    description:
      'Resolved trakt object when a tmdb id matches, null otherwise.',
  }),
  // younify fields — all nullish, plex items won't carry them.
  service_id: z.string().nullish(),
  content_id: z.string().nullish(),
  profile_id: z.string().nullish(),
  tmdb_id: z.number().int().nullish(),
  tmdb_series_id: z.number().int().nullish(),
  watched_at: z.string().datetime().nullish().openapi({
    description: 'History timestamp, normalized to `.000Z`.',
  }),
  rated_at: z.string().datetime().nullish().openapi({
    description: 'Rating timestamp, normalized to `.000Z`.',
  }),
  progress: float(z.number()).nullish(),
  rating_type: z.string().nullish(),
  rating_value: z.number().int().nullish(),
}).passthrough();
