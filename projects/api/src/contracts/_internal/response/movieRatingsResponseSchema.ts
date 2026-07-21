import { z } from '../z.ts';
import {
  externalRatingsResponseSchema,
  ratingsResponseSchema,
} from './ratingsResponseSchema.ts';

/**
 * Zod schema for the movie ratings response - the shared ratings shape plus the
 * film-specific Letterboxd and MyAnimeList blocks.
 */
export const movieRatingsResponseSchema = ratingsResponseSchema.extend({
  /***
   * Letterboxd audience rating on a 0-5 scale. Films only.
   * Available if requesting extended `all`.
   */
  letterboxd: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullish(),
  }).nullish(),
  /***
   * MyAnimeList audience rating on a 0-10 scale. Anime only.
   * Available if requesting extended `all`.
   */
  mal: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullish(),
  }).nullish(),
});
