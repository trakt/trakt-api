import { z } from '../../../_internal/z.ts';

const collectedValueSchema = z.string().openapi({
  description:
    'When the item was collected, as an ISO 8601 datetime. When `available_on` is sent, the value is `collected_at|source`: `source` is `plex` or `jellyfin` for items synced from a media server, and empty for everything else (for example `2002-07-19T21:00:00.000Z|`).',
});

/**
 * Zod schema for the collection minimal response. Each value is the
 * `collected_at` datetime, followed by `|source` when `available_on` is sent.
 */
export const collectionMinimalResponseSchema = z.record(
  z.string(),
  collectedValueSchema,
);

/** Zod schema for the collection minimal show response. */
export const collectionMinimalShowResponseSchema = z.record(
  z.string(),
  z.record(z.string(), collectionMinimalResponseSchema),
);
