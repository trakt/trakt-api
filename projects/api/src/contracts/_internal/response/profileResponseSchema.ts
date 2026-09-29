import { z } from '../z.ts';
import { vipVeteranTitleSchema } from './vipVeteranTitleSchema.ts';

// FIXME: split up in user profile, and official user
/** Zod schema for the profile response. */
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
  age: z.number().int().nullish(),
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
  /***
   * Available if requesting extended `vip`. Start of the current run of
   * unbroken paid VIP, allowing gaps of up to 31 days. Null without one.
   */
  vip_veteran_since: z.string().datetime().nullish(),
  /***
   * Available if requesting extended `vip`. Whole years since
   * `vip_veteran_since`.
   */
  vip_veteran_years: z.number().int().nullish(),
  /***
   * Available if requesting extended `vip`. Highest reached rung of the
   * 1 / 3 / 5 / 7 / 10 year ladder. Drives the badge colour.
   */
  vip_veteran_tier: z.number().int().nullish(),
  /***
   * Available if requesting extended `vip`. `veteran` from 5 years, `legend`
   * from 10. Null below 5 years.
   */
  vip_veteran_title: vipVeteranTitleSchema.nullish(),
  /***
   * Available if requesting extended `vip` on your own profile. When the
   * current streak breaks if the membership is not renewed.
   */
  vip_grace_ends_at: z.string().datetime().nullish(),
});
