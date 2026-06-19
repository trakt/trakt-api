import { commentResponseSchema } from '../../../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { seasonResponseSchema } from '../../../shows/schema/response/seasonResponseSchema.ts';

export const userCommentResponseSchema = z.object({
  comment: commentResponseSchema,
  type: z.enum(['movie', 'show', 'season', 'episode']),
  movie: movieResponseSchema.optional(),
  show: showResponseSchema.optional(),
  season: seasonResponseSchema.optional(),
  episode: episodeResponseSchema.optional(),
});
