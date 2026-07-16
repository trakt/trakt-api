import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';
import { historyActionSchema } from './historyActionSchema.ts';

/** Zod schema for the movie activity history response. */
export const movieActivityHistoryResponseSchema = z.object({
  id: int64(z.number().int()),
  watched_at: z.string().datetime(),
  action: historyActionSchema,
}).merge(typedMovieResponseSchema);
