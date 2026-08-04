import { z } from '../z.ts';

/** Zod schema for the translations language query parameters. */
export const translationsLanguageQuerySchema = z.object({
  language: z.string().nullish().openapi({
    description: 'Filter translations to a 2 character language code',
  }),
});
