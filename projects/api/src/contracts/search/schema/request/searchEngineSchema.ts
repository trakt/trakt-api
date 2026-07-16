import { z } from '../../../_internal/z.ts';

/** Zod schema for search engine. */
export const searchEngineSchema = z.object({
  engine: z.string().nullish().openapi({
    description: 'The search engine type to use.',
  }),
});
