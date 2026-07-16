import { z } from '../z.ts';

/** Zod schema for the media colors response. */
export const mediaColorsResponseSchema = z.object({
  poster: z.array(z.string()).nullish(),
});
