import { z } from '../z.ts';

/** Zod schema for the language query parameters. */
export const languageQuerySchema = z.object({
  language: z.string().nullish().openapi({
    description: 'Filter comments to a 2 character language code',
  }),
});
