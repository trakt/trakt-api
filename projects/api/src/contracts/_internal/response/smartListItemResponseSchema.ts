import { movieResponseSchema } from './movieResponseSchema.ts';
import { showResponseSchema } from './showResponseSchema.ts';
import { z } from '../z.ts';

/** Zod schema for the smart list item response. */
export const smartListItemResponseSchema = z.object({
  rank: z.number().int(),
  type: z.string(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
