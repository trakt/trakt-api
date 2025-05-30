import { z } from '../z.ts';

// FIXME: split up in user profile, and official user
export const profileResponseSchema = z.object({
  username: z.string(),
  private: z.boolean(),
  deleted: z.boolean(),
  name: z.string().nullish(),
  vip: z.boolean().nullish(),
  vip_ep: z.boolean().nullish(),
  director: z.boolean().nullish(),
  ids: z.object({
    slug: z.string().nullish(),
    trakt: z.number().int(),
  }),
  /***
   * Available if requesting extended `full`.
   */
  joined_at: z.string().datetime().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  location: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  about: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  gender: z.string().nullish(),
  /***
   * Available if requesting extended `full`.
   */
  age: z.number().int().or(z.null()).nullish(),
  /***
   * Available if requesting extended `images`.
   */
  images: z.object({ avatar: z.object({ full: z.string() }) }).nullish(),
  /***
   * Available if requesting extended `vip`.
   */
  vip_og: z.boolean().nullish(),
  /***
   * Available if requesting extended `vip`.
   */
  vip_years: z.number().int().nullish(),
  /***
   * Available if requesting extended `vip`.
   */
  vip_cover_image: z.string().nullish(),
});
