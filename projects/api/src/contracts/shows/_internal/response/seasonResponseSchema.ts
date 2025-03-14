import { seasonIdsResponseSchema } from '../../../_internal/response/seasonIdsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const seasonResponseSchema = z.object({
  number: z.number(),
  ids: seasonIdsResponseSchema,
  /**
   * Available if requesting extended `full`.
   */
  aired_episodes: z.number().optional(),
  /**
   * Available if requesting extended `full`.
   */
  rating: z.number().optional(
    /**
     * Available if requesting extended `full`.
     */
  ),
  votes: z.number().optional(),
  /**
   * Available if requesting extended `full`.
   */
  episode_count: z.number().optional(),
  /**
   * Available if requesting extended `full`.
   */
  title: z.string().optional(),
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
  updated_at: z.string().optional(),
  /**
   * Available if requesting extended `full`.
   */
  network: z.string().optional(),
  /**
   * Available if requesting extended `images`.
   */
  images: z.object({
    poster: z.array(z.string()),
    thumb: z.array(z.string()),
  }).optional(),
});
