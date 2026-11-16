import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { seasonResponseSchema } from '../../../shows/schema/response/seasonResponseSchema.ts';

/** Zod schema for the hidden item response. */
export const hiddenItemResponseSchema = z.object({
  hidden_at: z.string().datetime().nullish(),
  type: z.enum(['movie', 'show', 'season', 'user']),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  season: seasonResponseSchema.nullish(),
  user: profileResponseSchema.nullish(),
});
