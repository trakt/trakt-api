import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { noteResponseSchema } from '../../../notes/index.ts';
import { personResponseSchema } from '../../../people/schema/response/personResponseSchema.ts';
import { seasonResponseSchema } from '../../../shows/schema/response/seasonResponseSchema.ts';

/** Zod schema for the user note response. */
export const userNoteResponseSchema = z.object({
  attached_to: z.object({
    type: z.string(),
    id: z.number().int().nullish(),
    watched_at: z.string().datetime().nullish(),
    collected_at: z.string().datetime().nullish(),
    rated_at: z.string().datetime().nullish(),
    rating: z.number().int().nullish(),
  }),
  type: z.enum(['movie', 'show', 'season', 'episode', 'person']),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  season: seasonResponseSchema.nullish(),
  episode: episodeResponseSchema.nullish(),
  person: personResponseSchema.nullish(),
  note: noteResponseSchema,
});
