import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Recommended movie response. */
export const recommendedMovieResponse = z.array(movieResponseSchema);
