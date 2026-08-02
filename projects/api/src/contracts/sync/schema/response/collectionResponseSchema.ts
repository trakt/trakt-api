import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import {
  showResponseSchema,
} from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { availableOnEnumSchema } from '../request/availableOnEnumSchema.ts';

const availableOnSchema = z.object({
  /***
   * Available if requesting extended `available_on`.
   */
  available_on: z.array(z.object({
    name: availableOnEnumSchema,
  })).nullish(),
});

const collectedItemSchema = z.object({
  collected_at: z.string().datetime(),
  updated_at: z.string().datetime(),
}).merge(availableOnSchema);

/** Zod schema for collected movie. */
export const collectedMovieSchema = z.object({
  type: z.literal('movie'),
  movie: movieResponseSchema.nullish(),
})
  .merge(collectedItemSchema);

/** Zod schema for collected episode. */
export const collectedEpisodeSchema = z.object({
  type: z.literal('episode'),
  episode: episodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
})
  .merge(collectedItemSchema);

const collectedSeasonEpisodeSchema = z.object({
  number: z.number().int(),
  collected_at: z.string().datetime(),
}).merge(availableOnSchema);

const collectedSeasonResponseSchema = z.object({
  number: z.number().int(),
  episodes: collectedSeasonEpisodeSchema.array(),
});

/** Zod schema for collected show. */
export const collectedShowSchema = z.object({
  last_collected_at: z.string().datetime().nullish(),
  last_updated_at: z.string().datetime().nullish(),
  seasons: collectedSeasonResponseSchema.array().nullish(),
})
  .merge(z.object({
    type: z.literal('show'),
    show: showResponseSchema.nullish(),
  }));

/**
 * A single entry in the merged collection feed (`/sync/collection/media`,
 * `/sync/collection/:type`): a collected movie, show, or episode, as one flat
 * object with the shape-specific fields nullish. Discriminate by `type`.
 */
export const collectionResponseSchema = z.object({
  type: z.enum(['movie', 'show', 'episode']),
  collected_at: z.string().datetime().nullish(),
  updated_at: z.string().datetime().nullish(),
  available_on: z.array(z.object({ name: availableOnEnumSchema })).nullish(),
  /** Collection metadata (media type, resolution, audio, 3D). */
  metadata: z.object({
    media_type: z.string().nullable(),
    resolution: z.string().nullable(),
    hdr: z.string().nullable(),
    audio: z.string().nullable(),
    audio_channels: z.string().nullable(),
    '3d': z.boolean().nullable(),
  }).nullable(),
  movie: movieResponseSchema.nullish(),
  episode: episodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  last_collected_at: z.string().datetime().nullish(),
  last_updated_at: z.string().datetime().nullish(),
  seasons: collectedSeasonResponseSchema.array().nullish(),
});
