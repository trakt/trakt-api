import { ignoreQuerySchema } from '../../../_internal/request/ignoreQuerySchema.ts';
import { pageQuerySchema } from '../../../_internal/request/pageQuerySchema.ts';

/** Zod schema for the paging and ignore parameters the recommendations routes read. */
export const personalizedRecommendationsQuerySchema = pageQuerySchema.merge(
  ignoreQuerySchema.pick({ ignore_watched: true, ignore_watchlisted: true }),
);
