import { z } from '../z.ts';

/** Zod schema for the media filter parameters. */
export const mediaFilterParamsSchema = z.object({
  watchnow: z.enum([
    'favorites',
    'any',
    'any_all',
    'free',
    'free_all',
    'subscriptions',
    'subscriptions_all',
  ]).nullish().openapi({
    description:
      `Use "favorites" for streaming on a favorite service of the user.
      Use "any" for streaming on any service in the user's country.
      Use "any_all" for streaming on any service in all countries.
      Use "free" for streaming for free in the user's country.
      Use "free_all" for streaming for free in all countries.
      Use "subscriptions" for streaming on any subscription service (Netflix, Hulu, etc) in the user's country.
      Use "subscriptions_all" streaming on any subscription service in all countries`,
  }),
  genres: z.string().nullish(),
  genres_operator: z.enum(['and', 'or']).nullish(),
  subgenres: z.string().nullish(),
  years: z.string().nullish(),
  ratings: z.string().nullish(),
  runtimes: z.string().nullish(),
  countries: z.string().nullish(),
  certifications: z.string().nullish(),
  networks: z.string().nullish(),
  keywords: z.string().nullish(),
  keywords_operator: z.enum(['and', 'or']).nullish(),
  languages: z.string().nullish(),
  statuses: z.string().nullish(),
  imdb_ratings: z.string().nullish(),
  rt_meters: z.string().nullish(),
  rt_user_meters: z.string().nullish(),
  letterboxd_ratings: z.string().nullish(),
  mal_ratings: z.string().nullish(),
});
