import { z } from '../z.ts';
import { awardRefResponseSchema } from './awardRefResponseSchema.ts';

/** Zod schema for one ceremony in the award catalog, with its awards. */
export const awardCatalogResponseSchema = awardRefResponseSchema.extend({
  media_types: z.enum(['movie', 'show']).array(),
  awards: awardRefResponseSchema
    .extend({
      kind: z.enum(['title', 'person']),
    })
    .array(),
});
