import { z } from '../z.ts';

/** Zod schema for the seasonal theme query parameter. */
export const themeQuerySchema = z.object({
  theme: z.string().nullish().openapi({
    description:
      'Apply a seasonal theme such as `halloween` or `christmas`. The server expands it into the filters for the feed and the media type, and any filter you send yourself takes priority. Unknown themes are ignored.',
  }),
});
