import { z } from '../z.ts';
import { genreEnumSchema } from './genreEnumSchema.ts';
import { imagesResponseSchema } from './imagesResponseSchema.ts';
import { mediaColorsResponseSchema } from './mediaColorsResponseSchema.ts';
import { movieCertificationResponseSchema } from './movieCertificationResponseSchema.ts';
import { movieIdsResponseSchema } from './movieIdsResponseSchema.ts';
import { statusResponseSchema } from './statusResponseSchema.ts';

export const movieResponseSchema = z.object({
  title: z.string(),
  year: z.number().int().optional(),
  ids: movieIdsResponseSchema,
  /***
   * Available if requesting extended `images`.
   */
  images: imagesResponseSchema.optional(),

  /***
   * Available if requesting extended `full`.
   */
  tagline: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  overview: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  released: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  runtime: z.number().int().optional(),
  /***
   * Available if requesting extended `full`.
   */
  country: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  status: statusResponseSchema.optional(),
  /***
   * Available if requesting extended `full`.
   */
  rating: z.number().int().optional(),
  /***
   * Available if requesting extended `full`.
   */
  votes: z.number().int().optional(),
  /***
   * Available if requesting extended `full`.
   */
  comment_count: z.number().int().optional(),
  /***
   * Available if requesting extended `full`.
   */
  trailer: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  homepage: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  updated_at: z.string().datetime().optional(),
  /***
   * Available if requesting extended `full`.
   */
  language: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  languages: z.array(z.string()).optional(),
  /***
   * Available if requesting extended `full`.
   */
  available_translations: z.array(z.string()).optional(),
  /***
   * Available if requesting extended `full`.
   */
  genres: z.array(genreEnumSchema).optional(),
  /***
   * Available if requesting extended `full`.
   */
  certification: movieCertificationResponseSchema.optional(),
  /***
   * Available if requesting extended `full`.
   */
  original_title: z.string().nullish(),
  /***
   * Available if requesting extended `colors`.
   */
  colors: mediaColorsResponseSchema.optional(),
});
