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

export const collectedMovieSchema = z.object({
  type: z.literal('movie'),
  movie: movieResponseSchema.nullish(),
})
  .merge(collectedItemSchema);

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

export const collectedShowSchema = z.object({
  last_collected_at: z.string().datetime().nullish(),
  last_updated_at: z.string().datetime().nullish(),
  seasons: collectedSeasonResponseSchema.array().nullish(),
})
  .merge(z.object({
    type: z.literal('show'),
    show: showResponseSchema.nullish(),
  }));

export const collectionResponseSchema = z.union([
  collectedMovieSchema,
  collectedShowSchema,
  collectedEpisodeSchema,
]);
