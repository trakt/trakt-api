import { crewPositionResponseSchema } from '../../../_internal/response/crewPositionResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const peopleSummaryResponseSchema = z.object({
  name: z.string(),
  ids: z.object({
    slug: z.string(),
    trakt: z.number().int(),
    tvdb: z.number().int().optional(),
    imdb: z.string().optional(),
    tmdb: z.number().int().optional(),
  }),
  /***
   * Available if requesting extended `full`.
   */
  social_ids: z.object({
    twitter: z.string().nullable(),
    facebook: z.string().nullable(),
    instagram: z.string().nullable(),
    wikipedia: z.string().nullable(),
  }).optional(),
  /***
   * Available if requesting extended `full`.
   */
  biography: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  birthday: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  death: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  birthplace: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  homepage: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  gender: z.enum(['male', 'female', 'non_binary']).nullish(),
  /***
   * Available if requesting extended `full`.
   */
  known_for_department: crewPositionResponseSchema.optional(),
  /***
   * Available if requesting extended `full`.
   */
  updated_at: z.string().datetime().optional(),
  /***
   * Available if requesting extended `images`.
   */
  images: z.object({
    headshot: z.array(z.string()),
    fanart: z.array(z.string()),
  }).optional(),
});
