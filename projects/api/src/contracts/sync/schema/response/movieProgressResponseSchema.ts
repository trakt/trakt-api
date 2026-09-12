import { z } from 'zod';
import { movieResponseSchema } from '../../../movies/index.ts';
import { playbackItemResponseSchema } from './playbackItemResponseSchema.ts';

/** Zod schema for the movie progress response. */
export const movieProgressResponseSchema = playbackItemResponseSchema.extend({
  type: z.literal('movie'),
  movie: movieResponseSchema,
});
