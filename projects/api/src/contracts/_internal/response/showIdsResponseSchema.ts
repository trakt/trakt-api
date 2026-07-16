import { z } from '../z.ts';
import { episodeIdsResponseSchema } from './episodeIdsResponseSchema.ts';

/** Zod schema for the show ids response. */
export const showIdsResponseSchema = episodeIdsResponseSchema.extend({
  slug: z.string(),
});
