import { z } from '../z.ts';

export const watchNowServiceResponseSchema = z.object({
  source: z.string(),
  link: z.string(),
  uhd: z.boolean(),
  currency: z.string().nullish(),
  prices: z.object({
    rent: z.string().nullish(),
    purchase: z.string().nullish(),
  }),
  /***
   * Available if requesting links `tvos`.
   */
  link_tvos: z.string().nullish(),
  /***
   * Available if requesting links `direct`.
   */
  link_direct: z.string().nullish(),
  /***
   * Available if requesting links `android`.
   */
  link_android: z.string().nullish(),
  /***
   * Available if requesting links `webos`.
   */
  link_webos: z.string().nullish(),
});

export const watchNowResponseSchema = z.record(
  z.string(),
  z.object({
    cable: z.array(z.unknown()),
    free: z.array(z.unknown()),
    cinema: z.array(z.unknown()),
    subscription: z.array(watchNowServiceResponseSchema),
    purchase: z.array(watchNowServiceResponseSchema),
  }),
);
