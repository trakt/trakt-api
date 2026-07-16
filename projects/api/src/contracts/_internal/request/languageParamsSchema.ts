import { z } from '../z.ts';

/** Zod schema for the language parameters. */
export const languageParamsSchema = z.object({
  language: z.string().openapi({ description: '2 character language code' }),
});
