import {
  movieIdsRequestSchema,
} from '../../../_internal/request/idsRequestSchema.ts';
import { float, z } from '../../../_internal/z.ts';

/*
  FIXME: verify data structure of the standard media
  schemas and reuse where applicable.
*/

/** Zod schema for the movie scrobble request. */
export const movieScrobbleRequestSchema = z.object({
  progress: float(z.number()),
  movie: z.object({
    title: z.string(),
    year: z.number().int(),
    ids: movieIdsRequestSchema,
  }).nullish(),
});
