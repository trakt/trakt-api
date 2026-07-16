import { z } from '../z.ts';

const list = z.array(z.string());
const range = z.array(z.number()).max(2);

export const smartListFiltersSchema = z.object({
  genres: list.optional(),
  subgenres: list.optional(),
  certifications: list.optional(),
  languages: list.optional(),
  countries: list.optional(),
  statuses: list.optional(),
  networks: list.optional(),
  watchnow: list.optional(),
  years: range.optional(),
  ratings: range.optional(),
  runtimes: range.optional(),
  imdb_ratings: range.optional(),
  rt_meters: range.optional(),
  rt_user_meters: range.optional(),
  ignore_watched: z.boolean().optional(),
  ignore_watchlisted: z.boolean().optional(),
});
