import { z } from '../z.ts';
import { smartListFiltersSchema } from './smartListFiltersSchema.ts';

/** Zod schema for smart list write. */
export const smartListWriteSchema = z.object({
  name: z.string().min(1),
  source: z.enum([
    'trending',
    'popular',
    'anticipated',
    'recommendations',
    'discover',
  ]),
  media_type: z.enum(['movies', 'shows', 'media']),
  filters: smartListFiltersSchema.optional(),
  privacy: z.enum(['public', 'private', 'friends']).optional(),
});
