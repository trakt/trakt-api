import { z } from 'zod';
import { int64 } from '../../../_internal/z.ts';
import { movieResponseSchema } from '../../../movies/index.ts';

export const movieProgressResponseSchema = z.object({
  progress: z.number().min(0).max(100),
  paused_at: z.string().datetime(),
  id: int64(z.number().int()),
  type: z.literal('movie'),
  movie: movieResponseSchema,
});
