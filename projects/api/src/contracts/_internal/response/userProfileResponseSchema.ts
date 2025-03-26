import { z } from '../z.ts';

// FIXME: split up in user profile, and official user
export const profileResponseSchema = z.object({
  username: z.string(),
  private: z.boolean(),
  deleted: z.boolean(),
  name: z.string().nullable(),
  vip: z.boolean(),
  vip_ep: z.boolean(),
  ids: z.object({
    slug: z.string().nullable(),
    trakt: z.number(),
  }),
  /***
   * Available if requesting extended `full`.
   */
  joined_at: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  location: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  about: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  gender: z.string().optional(),
  /***
   * Available if requesting extended `full`.
   */
  age: z.number().or(z.null()).optional(),
  /***
   * Available if requesting extended `full`.
   */
  images: z.object({ avatar: z.object({ full: z.string() }) }).optional(),
  /***
   * Available if requesting extended `vip`.
   */
  vip_og: z.boolean().optional(),
  /***
   * Available if requesting extended `vip`.
   */
  vip_years: z.number().optional(),
  /***
   * Available if requesting extended `vip`.
   */
  vip_cover_image: z.string().optional(),
});
