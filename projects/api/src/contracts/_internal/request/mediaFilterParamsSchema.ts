import { z } from '../z.ts';

const SEVERITY_RANGE =
  'Parental guide severity range `min-max`, from 0 (none) to 3 (severe).';

/** Zod schema for the media filter parameters. */
export const mediaFilterParamsSchema = z.object({
  watchnow: z
    .enum([
      'favorites',
      'any',
      'any_all',
      'free',
      'free_all',
      'subscriptions',
      'subscriptions_all',
    ])
    .nullish()
    .openapi({
      description: `Use "favorites" for streaming on a favorite service of the user.
      Use "any" for streaming on any service in the user's country.
      Use "any_all" for streaming on any service in all countries.
      Use "free" for streaming for free in the user's country.
      Use "free_all" for streaming for free in all countries.
      Use "subscriptions" for streaming on any subscription service (Netflix, Hulu, etc) in the user's country.
      Use "subscriptions_all" streaming on any subscription service in all countries`,
    }),
  genres: z.string().nullish(),
  subgenres: z.string().nullish(),
  years: z.string().nullish(),
  ratings: z.string().nullish(),
  start_date: z.string().nullish(),
  end_date: z.string().nullish(),
  runtimes: z.string().nullish(),
  countries: z.string().nullish(),
  statuses: z.string().nullish(),
  certifications: z.string().nullish(),
  parental_nudity: z.string().nullish().describe(SEVERITY_RANGE),
  parental_violence: z.string().nullish().describe(SEVERITY_RANGE),
  parental_profanity: z.string().nullish().describe(SEVERITY_RANGE),
  parental_alcohol: z.string().nullish().describe(SEVERITY_RANGE),
  parental_frightening: z.string().nullish().describe(SEVERITY_RANGE),
  parental_include_unrated: z
    .boolean()
    .nullish()
    .describe('Also include titles without parental guide ratings.'),
});
