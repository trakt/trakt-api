import { z } from '../../../_internal/z.ts';

/** Zod schema for the language query parameter of a single person. */
export const personLanguageQuerySchema = z.object({
  language: z.string().nullish().openapi({
    description:
      'Language code to pick the Wikipedia page in, like `pt` or `pt-br`. Falls back to the base language, then English.',
  }),
});
