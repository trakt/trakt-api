import { crewPositionResponseSchema } from '../../../_internal/response/crewPositionResponseSchema.ts';
import { asString, z } from '../../../_internal/z.ts';

export const personResponseSchema = z.object({
  name: z.string(),
  ids: z.object({
    slug: z.string(),
    trakt: z.number().int(),
    tvdb: z.number().int().nullish(),
    imdb: z.string().nullish(),
    tmdb: z.number().int().nullish(),
  }),
  /***
   * Available if requesting extended `full`.
   */
  social_ids: z.object({
    twitter: z.string().nullish(),
    facebook: z.string().nullish(),
    instagram: z.string().nullish(),
    wikipedia: z.string().nullish(),
  }).nullish(),
  /***
   * Available if requesting extended `full`.
   */
  biography: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  birthday: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  death: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  birthplace: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  homepage: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  gender: asString(z.enum(['male', 'female', 'non_binary'])).nullish(),
  /***
   * Available if requesting extended `full`.
   */
  known_for_department: crewPositionResponseSchema.nullish(),
  /***
   * Available if requesting extended `full`.
   */
  updated_at: z.string().datetime().nullish(),
  /***
   * Available if requesting extended `images`.
   */
  images: z.object({
    headshot: z.array(z.string()),
    fanart: z.array(z.string()),
  }).nullish(),
});
