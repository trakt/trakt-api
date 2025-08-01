import { float, z } from '../z.ts';
import { episodeIdsResponseSchema } from './episodeIdsResponseSchema.ts';
import { showResponseSchema } from './showResponseSchema.ts';

export const episodeResponseSchema = z.object({
  season: z.number().int(),
  number: z.number().int(),
  title: z.string(),
  first_aired: z.string(),
  number_abs: z.number().int().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  rating: float(z.number()).nullish(),
  /***
   * Available if requesting extended `full`.
   */
  votes: z.number().int().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  comment_count: z.number().int().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  updated_at: z.string().datetime().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  available_translations: z.array(z.string()).nullish(),
  /***
   * Available if requesting extended `full`.
   */
  runtime: z.number().int().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  overview: z.string().nullish(),
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
    .nullish(),
  ids: episodeIdsResponseSchema,
  /***
   * Available if requesting extended `full`.
   */
  original_title: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  after_credits: z.boolean().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  during_credits: z.boolean().nullish(),
  /***
   * Available if requesting extended `images`.
   */
  images: z
    .object({ screenshot: z.array(z.string()) })
    .nullish(),
});

export const typedEpisodeResponseSchema = z.object({
  type: z.literal('episode'),
  episode: episodeResponseSchema,
  show: showResponseSchema,
});
