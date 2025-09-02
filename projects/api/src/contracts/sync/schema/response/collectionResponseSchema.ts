import { typedEpisodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import {
  typedShowResponseSchema,
} from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { seasonResponseSchema } from '../../../shows/schema/response/seasonResponseSchema.ts';
import { availableOnEnumSchema } from '../request/availableOnEnumSchema.ts';

const collectedItemSchema = z.object({
  collected_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  /***
   * Available if requesting extended `available_on`.
   */
  available_on: z.array(z.object({
    name: availableOnEnumSchema,
  })).nullish(),
});

const collectedMovieSchema = typedMovieResponseSchema
  .merge(collectedItemSchema);

const collectedShowSchema = z.object({
  seasons: seasonResponseSchema.array(),
})
  .merge(typedShowResponseSchema)
  .merge(collectedItemSchema);

const collectedEpisodeSchema = typedEpisodeResponseSchema
  .merge(collectedItemSchema);

export const collectionResponseSchema = z.discriminatedUnion('type', [
  collectedMovieSchema,
  collectedShowSchema,
  collectedEpisodeSchema,
]);
