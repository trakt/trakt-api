import {
  movieIdsRequestSchema,
} from '../../../_internal/request/idsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

/*
  FIXME: verify data structure of the standard media
  schemas and reuse where applicable.
*/

export const movieScrobbleRequestSchema = z.object({
  progress: z.number().int(),
  movie: z.object({
    title: z.string(),
    year: z.number().int(),
    ids: movieIdsRequestSchema,
  }),
});
