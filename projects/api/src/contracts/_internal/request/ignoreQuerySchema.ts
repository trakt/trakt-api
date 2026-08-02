import { z } from '../z.ts';

/** Zod schema for the ignore query parameters. */
export const ignoreQuerySchema = z.object({
  ignore_watched: z.boolean().nullish().openapi({
    description: 'Ignore watched items.',
  }),
  ignore_watchlisted: z.boolean().nullish().openapi({
    description: 'Ignore watchlisted items.',
  }),
  hide: z.string().nullish().openapi({
    description:
      'Comma delimited list of states to hide: `watched`, `watchlist`, `watching`, `unreleased`, `ended`, `airing`, `no_release_date`, `released`.',
  }),
  hide_watched: z.boolean().nullish().openapi({
    description: 'Hide watched items.',
  }),
  hide_watchlisted: z.boolean().nullish().openapi({
    description: 'Hide watchlisted items.',
  }),
  hide_watching: z.boolean().nullish().openapi({
    description: 'Hide items the user is currently watching.',
  }),
  hide_unreleased: z.boolean().nullish().openapi({
    description: 'Hide unreleased items.',
  }),
  hide_ended: z.boolean().nullish().openapi({
    description: 'Hide ended shows.',
  }),
  hide_airing: z.boolean().nullish().openapi({
    description: 'Hide currently airing shows.',
  }),
  hide_no_release_date: z.boolean().nullish().openapi({
    description: 'Hide items without a release date.',
  }),
  hide_released: z.boolean().nullish().openapi({
    description: 'Hide released items.',
  }),
});
