import { seasonIdsResponseSchema } from '../../../_internal/response/seasonIdsResponseSchema.ts';
import { float, z } from '../../../_internal/z.ts';

export const seasonResponseSchema = z.object({
  number: z.number().int(),
  ids: seasonIdsResponseSchema,
  /**
   * Available if requesting extended `full`.
   */
  aired_episodes: z.number().int().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  rating: float(z.number()).nullish(),
  /**
   * Available if requesting extended `full`.
   */
  votes: z.number().int().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  episode_count: z.number().int().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  title: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  overview: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  first_aired: z.string().optional(
    /**
     * Available if requesting extended `full`.
     */
  ),
  updated_at: z.string().datetime().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  network: z.string().nullish(),
  /**
   * Available if requesting extended `images`.
   */
  images: z.object({
    poster: z.array(z.string()),
    thumb: z.array(z.string()),
  }).nullish(),
});
