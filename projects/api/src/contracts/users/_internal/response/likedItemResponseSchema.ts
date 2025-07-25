import { commentResponseSchema } from '../../../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { listResponseSchema } from '../../../_internal/response/listResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { seasonResponseSchema } from '../../../shows/_internal/response/seasonResponseSchema.ts';

const likedMovieCommentResponseSchema = z.object({
  /***
   * Available if requesting extended `comments`.
   */
  comment_type: z.literal('movie'),
  /***
   * Available if requesting extended `comments`.
   */
  movie: movieResponseSchema.nullish(),
});

const likedShowCommentResponseSchema = z.object({
  /***
   * Available if requesting extended `comments`.
   */
  comment_type: z.literal('show'),
  /***
   * Available if requesting extended `comments`.
   */
  show: showResponseSchema.nullish(),
});

const likedSeasonCommentResponseSchema = z.object({
  /***
   * Available if requesting extended `comments`.
   */
  comment_type: z.literal('season'),
  /***
   * Available if requesting extended `comments`.
   */
  show: showResponseSchema.nullish(),
  /***
   * Available if requesting extended `comments`.
   */
  season: seasonResponseSchema.nullish(),
});

const likedEpisodeCommentResponseSchema = z.object({
  /***
   * Available if requesting extended `comments`.
   */
  comment_type: z.literal('episode'),
  /***
   * Available if requesting extended `comments`.
   */
  episode: episodeResponseSchema.nullish(),
});

const likedExtendedCommentResponseSchema = z.union(
  [
    likedMovieCommentResponseSchema.partial(),
    likedShowCommentResponseSchema.partial(),
    likedEpisodeCommentResponseSchema.partial(),
    likedSeasonCommentResponseSchema.partial(),
  ],
);

export const likedCommentResponseSchema = z.object({
  liked_at: z.string().datetime(),
  type: z.literal('comment'),
  /***
   * When using extended 'min', only the id is returned
   */
  comment: commentResponseSchema.partial()
    .extend({ id: z.number().int() }),
}).and(likedExtendedCommentResponseSchema);

export const likedListResponseSchema = z.object({
  liked_at: z.string().datetime(),
  type: z.literal('list'),
  /***
   * When using extended 'min', only the id is returned
   */
  list: listResponseSchema.partial()
    .extend({ id: z.number().int() }),
});
