import { commentResponseSchema } from '../../../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { typedShowResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { seasonResponseSchema } from '../../../shows/_internal/response/seasonResponseSchema.ts';

const commentedMovieResponseSchema = z.object({
  comment: commentResponseSchema,
}).merge(typedMovieResponseSchema);

const commentedShowResponseSchema = z.object({
  comment: commentResponseSchema,
}).merge(typedShowResponseSchema);

const commentedSeasonResponseSchema = z.object({
  type: z.literal('season'),
  season: seasonResponseSchema,
  comment: commentResponseSchema,
});

const commentedEpisodeResponseSchema = z.object({
  type: z.literal('episode'),
  episode: episodeResponseSchema,
  comment: commentResponseSchema,
});

export const userCommentResponseSchema = z.discriminatedUnion('type', [
  commentedMovieResponseSchema,
  commentedShowResponseSchema,
  commentedSeasonResponseSchema,
  commentedEpisodeResponseSchema,
]);
