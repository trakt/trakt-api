import { mediaFilterParamsSchema } from './mediaFilterParamsSchema.ts';

/** Zod schema for the media filter parameters the recommendations pipeline applies. */
export const recommendationsFilterParamsSchema = mediaFilterParamsSchema.omit({
  networks: true,
  keywords: true,
  keywords_operator: true,
  genres_operator: true,
  letterboxd_ratings: true,
  mal_ratings: true,
});
