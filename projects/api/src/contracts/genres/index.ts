import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';

const genreTypeParamsSchema = z.object({
  type: z.string().describe('Media type to return genres for.'),
});

/** Zod schema for the genre response. */
export const genreResponseSchema = z.object({
  name: z.string(),
  slug: z.string(),
  subgenres: z.array(z.object({
    name: z.string(),
    slug: z.string(),
  })).optional(),
});

/** ts-rest contract for the `genres` endpoints. */
export const genres = builder.router({
  list: {
    summary: 'Get genres',
    description: `Get a list of all genres, including names and slugs.

#### Subgenres

Send \`?extended=subgenres\` to get a list of subgenres for each genre. You can get more creative with advanced filters by using the subgenres in your app.`,
    path: '/:type',
    method: 'GET',
    pathParams: genreTypeParamsSchema,
    query: extendedQuerySchemaFactory<['subgenres']>(),
    responses: {
      200: genreResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/genres',
});

/** The genre response payload. */
export type GenreResponse = z.infer<typeof genreResponseSchema>;
