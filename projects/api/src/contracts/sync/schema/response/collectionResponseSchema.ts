import { typedEpisodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import {
  typedShowResponseSchema,
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

const collectedMovieSchema = typedMovieResponseSchema
  .merge(collectedItemSchema);

const collectedEpisodeSchema = typedEpisodeResponseSchema
  .merge(collectedItemSchema);

const collectedSeasonEpisodeSchema = z.object({
  number: z.number().int(),
  collected_at: z.string().datetime(),
}).merge(availableOnSchema);

const collectedSeasonResponseSchema = z.object({
  number: z.number().int(),
  episodes: collectedSeasonEpisodeSchema.array(),
});

const collectedShowSchema = z.object({
  last_collected_at: z.string().datetime(),
  last_updated_at: z.string().datetime(),
  seasons: collectedSeasonResponseSchema.array(),
})
  .merge(typedShowResponseSchema);

export const collectionResponseSchema = z.discriminatedUnion('type', [
  collectedMovieSchema,
  collectedShowSchema,
  collectedEpisodeSchema,
]);
