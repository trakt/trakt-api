import { z } from '../z.ts';

const list = z.array(z.string());
const range = z.array(z.number()).max(2);

// Applies to the include arm only: 'and' requires every value, 'or' (default)
// any of them. Exclusion is always "carries none of".
const operator = z.enum(['and', 'or']);

/** Zod schema for smart list filters. */
export const smartListFiltersSchema = z.object({
  genres: list.optional(),
  genres_operator: operator.optional(),
  subgenres: list.optional(),
  certifications: list.optional(),
  languages: list.optional(),
  countries: list.optional(),
  statuses: list.optional(),
  networks: list.optional(),
  keywords: list.optional(),
  keywords_operator: operator.optional(),
  watchnow: list.optional(),
  years: range.optional(),
  ratings: range.optional(),
  runtimes: range.optional(),
  imdb_ratings: range.optional(),
  rt_meters: range.optional(),
  rt_user_meters: range.optional(),
  letterboxd_ratings: range.optional(),
  mal_ratings: range.optional(),
  ignore_watched: z.boolean().optional(),
  ignore_watchlisted: z.boolean().optional(),
  ignore_watching: z.boolean().optional(),
  ignore_unreleased: z.boolean().optional(),
  ignore_released: z.boolean().optional(),
  ignore_ended: z.boolean().optional(),
  ignore_airing: z.boolean().optional(),
  ignore_no_release_date: z.boolean().optional(),
});
