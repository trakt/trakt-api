import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';
import { listResponseSchema } from '../../../models/index.ts';
import { personResponseSchema } from '../../../people/schema/response/personResponseSchema.ts';

/** Zod schema for the search result response. */
export const searchResultResponseSchema = z.object({
  score: int64(z.number().int()),
  type: z.enum(['movie', 'show', 'episode', 'person', 'list']),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  episode: episodeResponseSchema.nullish(),
  person: personResponseSchema.nullish(),
  list: listResponseSchema.nullish(),
});
