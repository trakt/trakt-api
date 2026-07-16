import { listedMovieResponseSchema } from './listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from './listedShowResponseSchema.ts';
import { z } from '../z.ts';

/** Zod schema for the smart list item response. */
export const smartListItemResponseSchema = z.object({
  rank: z.number().int(),
  type: z.string(),
  movie: listedMovieResponseSchema.nullish(),
  show: listedShowResponseSchema.nullish(),
});
