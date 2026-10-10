import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the media trending response. */
export const mediaTrendingResponseSchema = z.object({
  watchers: z.number().int(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
