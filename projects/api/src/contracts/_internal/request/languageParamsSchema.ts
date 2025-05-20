import { z } from '../z.ts';

export const languageParamsSchema = z.object({
  language: z.string().openapi({ description: '2 character language code' }),
});
