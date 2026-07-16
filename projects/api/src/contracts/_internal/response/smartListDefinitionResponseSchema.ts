import { smartListFiltersSchema } from '../request/smartListFiltersSchema.ts';
import { z } from '../z.ts';

/** Zod schema for the smart list definition response. */
export const smartListDefinitionResponseSchema = z.object({
  name: z.string(),
  privacy: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  ids: z.object({
    trakt: z.number().int(),
    slug: z.string(),
  }),
  images: z.object({
    posters: z.string().array(),
  }),
  source: z.string(),
  media_type: z.string(),
  filters: smartListFiltersSchema,
});
