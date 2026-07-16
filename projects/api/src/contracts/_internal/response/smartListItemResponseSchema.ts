import { listedMovieResponseSchema } from './listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from './listedShowResponseSchema.ts';
import { z } from '../z.ts';

export const smartListItemResponseSchema = z.object({
  rank: z.number().int(),
  type: z.string(),
  movie: listedMovieResponseSchema.nullish(),
  show: listedShowResponseSchema.nullish(),
});
