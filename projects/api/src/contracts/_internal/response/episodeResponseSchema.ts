import { z } from '../z.ts';
import { episodeIdsResponseSchema } from './episodeIdsResponseSchema.ts';

export const episodeResponseSchema = z.object({
  season: z.number(),
  number: z.number(),
  title: z.string(),
  first_aired: z.string(),
  number_abs: z.number().nullable(),
  /***
   * Available if requesting extended `full`.
   */
  rating: z.number(),
  /***
   * Available if requesting extended `full`.
   */
  votes: z.number(),
  /***
   * Available if requesting extended `full`.
   */
  comment_count: z.number(),
  /***
   * Available if requesting extended `full`.
   */
  updated_at: z.string(),
  /***
   * Available if requesting extended `full`.
   */
  available_translations: z.array(z.string()),
  /***
   * Available if requesting extended `full`.
   */
  runtime: z.number(),
  /***
   * Available if requesting extended `full`.
   */
  overview: z.string().nullable(),
  /***
   * Available if requesting extended `full`.
   */
  episode_type: z
    .enum([
      'standard',
      'series_premiere',
      'season_premiere',
      'mid_season_finale',
      'mid_season_premiere',
      'season_finale',
      'series_finale',
    ])
    .optional(),
  ids: episodeIdsResponseSchema,
  /***
   * Available if requesting extended `images`.
   */
  images: z
    .object({ screenshot: z.array(z.string()) })
    .optional(),
  /***
   * Available if requesting extended `full`.
   */
  original_title: z.string().nullish(),
});
