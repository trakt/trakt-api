import { commentResponseSchema } from '../../../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { listResponseSchema } from '../../../_internal/response/listResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { personResponseSchema } from '../../../people/schema/response/personResponseSchema.ts';
import { seasonResponseSchema } from '../../../shows/schema/response/seasonResponseSchema.ts';

/** Zod schema for the comment item response. */
export const commentItemResponseSchema = z.object({
  type: z.string(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  season: seasonResponseSchema.nullish(),
  episode: episodeResponseSchema.nullish(),
  person: personResponseSchema.nullish(),
  list: listResponseSchema.nullish(),
  comment: commentResponseSchema.nullish(),
  user: profileResponseSchema.nullish(),
});
