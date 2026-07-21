import { z } from '../z.ts';
import {
  externalRatingsResponseSchema,
  ratingsResponseSchema,
} from './ratingsResponseSchema.ts';

/**
 * Zod schema for the show ratings response - the shared ratings shape plus the
 * MyAnimeList block. Letterboxd is films-only, so it is absent here.
 */
export const showRatingsResponseSchema = ratingsResponseSchema.extend({
  /***
   * MyAnimeList audience rating on a 0-10 scale. Anime only.
   * Available if requesting extended `all`.
   */
  mal: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullish(),
  }).nullish(),
});
