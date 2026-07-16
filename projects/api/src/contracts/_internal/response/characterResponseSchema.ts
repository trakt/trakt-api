import { z } from '../z.ts';

/** Zod schema for the character response. */
export const characterResponseSchema = z.object({
  character: z.string(),
  characters: z.array(z.string()),
});
