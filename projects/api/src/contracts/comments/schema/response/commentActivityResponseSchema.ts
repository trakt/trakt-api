import { commentResponseSchema } from '../../../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { listResponseSchema } from '../../../_internal/response/listResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { seasonResponseSchema } from '../../../shows/schema/response/seasonResponseSchema.ts';

/** Zod schema for the comment activity response. */
export const commentActivityResponseSchema = z.object({
  type: z.enum(['movie', 'show', 'season', 'episode', 'list']),
  comment: commentResponseSchema,
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  season: seasonResponseSchema.nullish(),
  episode: episodeResponseSchema.nullish(),
  list: listResponseSchema.nullish(),
});
