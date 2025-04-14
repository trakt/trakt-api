import { z } from '../z.ts';
import { genreEnumSchema } from './genreEnumSchema.ts';
import { imagesResponseSchema } from './imagesResponseSchema.ts';
import { mediaColorsResponseSchema } from './mediaColorsResponseSchema.ts';
import { showCertificationResponseSchema } from './showCertificationResponseSchema.ts';
import { showIdsResponseSchema } from './showIdsResponseSchema.ts';
import { statusResponseSchema } from './statusResponseSchema.ts';

export const showResponseSchema = z.object({
  title: z.string(),
  year: z.number().optional(),
  ids: showIdsResponseSchema,
  /***
   * Available if requesting extended `images`.
   */
  images: imagesResponseSchema.optional(),
  /**
   * Available if requesting extended `full`.
   */
  aired_episodes: z.number().optional(),
  /**
   * Available if requesting extended `full`.
   */
  tagline: z.string().optional(),
  /**
   * Available if requesting extended `full`.
   */
  overview: z.string().optional(),
  /**
   * Available if requesting extended `full`.
   */
  first_aired: z.string().optional(),
  /**
   * Available if requesting extended `full`.
   */
  airs: z.object({
    day: z.string().optional(),
    time: z.string().optional(),
    timezone: z.string().optional(),
  }).optional(),
  /**
   * Available if requesting extended `full`.
   */
  runtime: z.number().optional(),
  /**
   * Available if requesting extended `full`.
   */
  certification: showCertificationResponseSchema.optional(),
  /**
   * Available if requesting extended `full`.
   */
  network: z.string().optional(),
  /**
   * Available if requesting extended `full`.
   */
  country: z.string().optional(),
  /**
   * Available if requesting extended `full`.
   */
  status: statusResponseSchema.optional(),
  /**
   * Available if requesting extended `full`.
   */
  rating: z.number().optional(),
  /**
   * Available if requesting extended `full`.
   */
  votes: z.number().optional(),
  /**
   * Available if requesting extended `full`.
   */
  comment_count: z.number().optional(),
  /**
   * Available if requesting extended `full`.
   */
  trailer: z.string().optional(),
  /**
   * Available if requesting extended `full`.
   */
  homepage: z.string().nullish(),
  /**
   * Available if requesting extended `full`.
   */
  updated_at: z.string().optional(),
  /**
   * Available if requesting extended `full`.
   */
  language: z.string().optional(),
  /**
   * Available if requesting extended `full`.
   */
  languages: z.array(z.string()).optional(),
  /**
   * Available if requesting extended `full`.
   */
  available_translations: z.array(z.string()).optional(),
  /**
   * Available if requesting extended `full`.
   */
  genres: z.array(genreEnumSchema).optional(),
  /***
   * Available if requesting extended `full`.
   */
  original_title: z.string().nullish(),
  /***
   * Available if requesting extended `colors`.
   */
  colors: mediaColorsResponseSchema.optional(),
});
