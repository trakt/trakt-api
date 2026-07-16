import { z } from 'zod';
import { float, int64 } from '../../../_internal/z.ts';
import { movieResponseSchema } from '../../../movies/index.ts';

/** Zod schema for the movie progress response. */
export const movieProgressResponseSchema = z.object({
  progress: float(z.number().min(0).max(100)),
  paused_at: z.string().datetime(),
  id: int64(z.number().int()),
  type: z.literal('movie'),
  movie: movieResponseSchema,
});
