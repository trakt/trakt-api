import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';

const languageTypeParamsSchema = z.object({
  type: z.string().describe('Media type to return languages for.'),
});

/** Zod schema for the language response. */
export const languageResponseSchema = z.object({
  name: z.string(),
  code: z.string(),
});

/** ts-rest contract for the `languages` endpoints. */
export const languages = builder.router({
  list: {
    summary: 'Get languages',
    description: 'Get a list of all languages, including names and codes.',
    path: '/:type',
    method: 'GET',
    pathParams: languageTypeParamsSchema,
    responses: {
      200: languageResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/languages',
});

/** The language response payload. */
export type LanguageResponse = z.infer<typeof languageResponseSchema>;
