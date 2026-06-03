import { z } from '../../../_internal/z.ts';

const countBlock = z.object({
  movies: z.number().int().optional(),
  episodes: z.number().int().optional(),
  shows: z.number().int().optional(),
  seasons: z.number().int().optional(),
});

export const syncSchema = z.object({
  id: z.number().int(),
  created_at: z.string().datetime().openapi({
    description: 'When the sync ran, normalized to `.000Z`.',
  }),
  kind: z.enum(['younify', 'plex', 'import']),
  source: z.string().nullable().openapi({
    description:
      'Streaming service / importer source (`netflix`, `plex`, `csv`, …), or null.',
  }),
  application: z.string().nullable().openapi({
    description:
      'Name of the OAuth app that created the sync; null for `application_id 0` importers.',
  }),
  undone: z.boolean(),
  undone_at: z.string().datetime().nullable().openapi({
    description: 'When the sync was reversed, normalized to `.000Z`, or null.',
  }),
  items: z.object({
    history: countBlock.optional(),
    library: countBlock.optional(),
    ratings: countBlock.optional(),
    watchlist: countBlock.optional(),
  }).openapi({
    description:
      'Added counts per section. Empty sections and media types are omitted.',
  }),
  paused_count: z.number().int(),
  skipped_count: z.number().int(),
});
