import { z } from '../../../_internal/z.ts';
import { movieResponseSchema } from '../../../movies/index.ts';
import { showResponseSchema } from '../../../shows/index.ts';

/** Zod schema for the media popular response. */
export const mediaPopularResponseSchema = z.union([
  movieResponseSchema,
  showResponseSchema,
]);
