import { float, z } from '../z.ts';

const list = z.array(z.string());
const intRange = z.array(z.number().int()).max(2);
const floatRange = z.array(float(z.number())).max(2);

// Applies to the include arm only: 'and' requires every value, 'or' (default)
// any of them. Exclusion is always "carries none of".
const operator = z.enum(['and', 'or']);

const severityRange = z.array(z.number().int().min(0).max(3)).max(2);

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
  watchnow_country: z.string().regex(/^[a-z]{2}$/).optional(),
  years: intRange.optional(),
  ratings: intRange.optional(),
  runtimes: intRange.optional(),
  imdb_ratings: floatRange.optional(),
  rt_meters: intRange.optional(),
  rt_user_meters: intRange.optional(),
  letterboxd_ratings: floatRange.optional(),
  mal_ratings: floatRange.optional(),
  parental_nudity: severityRange.optional(),
  parental_violence: severityRange.optional(),
  parental_profanity: severityRange.optional(),
  parental_alcohol: severityRange.optional(),
  parental_frightening: severityRange.optional(),
  parental_include_unrated: z.boolean().optional(),
  ignore_watched: z.boolean().optional(),
  ignore_watchlisted: z.boolean().optional(),
  ignore_watching: z.boolean().optional(),
  ignore_unreleased: z.boolean().optional(),
  ignore_released: z.boolean().optional(),
  ignore_ended: z.boolean().optional(),
  ignore_airing: z.boolean().optional(),
  ignore_no_release_date: z.boolean().optional(),
});
