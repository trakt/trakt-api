import { z } from '../z.ts';

export const languageQuerySchema = z.object({
  language: z.string().nullish().openapi({
    description: 'Filter comments to a 2 character language code',
  }),
});
