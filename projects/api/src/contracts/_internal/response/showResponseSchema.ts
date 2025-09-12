import { float, z } from '../z.ts';
import { genreEnumSchema } from './genreEnumSchema.ts';
import { imagesResponseSchema } from './imagesResponseSchema.ts';
import { mediaColorsResponseSchema } from './mediaColorsResponseSchema.ts';
import { showCertificationResponseSchema } from './showCertificationResponseSchema.ts';
import { showIdsResponseSchema } from './showIdsResponseSchema.ts';
import { statusResponseSchema } from './statusResponseSchema.ts';

export const showResponseSchema = z.object({
  title: z.string(),
  year: z.number().int().nullish(),
  ids: showIdsResponseSchema,
  /***
   * Available if requesting extended `images`.
   */
  images: imagesResponseSchema.nullish(),
  /**
   * Available if requesting extended `full`.
   */
  aired_episodes: z.number().int().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  tagline: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  overview: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  first_aired: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  airs: z.object({
    day: z.string().nullish(),
    time: z.string().nullish(),
    timezone: z.string().nullish(),
  }).nullish(),
  /**
   * Available if requesting extended `full`.
   */
  runtime: z.number().int().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  certification: showCertificationResponseSchema.nullish(),
  /**
   * Available if requesting extended `full`.
   */
  network: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  country: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  status: statusResponseSchema.nullish(),
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
  comment_count: z.number().int().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  trailer: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  homepage: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  updated_at: z.string().datetime().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  language: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  languages: z.array(z.string()).nullish(),
  /**
   * Available if requesting extended `full`.
   */
  available_translations: z.array(z.string()).nullish(),
  /**
   * Available if requesting extended `full`.
   */
  genres: z.array(genreEnumSchema).nullish(),
  /***
   * Available if requesting extended `full`.
   */
  subgenres: z.array(z.string()).nullish(),
  /***
   * Available if requesting extended `full`.
   */
  original_title: z.string().nullish(),
  /***
   * Available if requesting extended `colors`.
   */
  colors: mediaColorsResponseSchema.nullish(),
});

export const typedShowResponseSchema = z.object({
  type: z.literal('show'),
  show: showResponseSchema,
});
