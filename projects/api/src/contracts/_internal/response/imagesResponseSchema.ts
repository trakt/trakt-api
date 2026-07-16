import { z } from '../z.ts';

/** Zod schema for the images response. */
export const imagesResponseSchema = z
  .object({
    fanart: z.array(z.string()),
    poster: z.array(z.string()),
    logo: z.array(z.string()),
    clearart: z.array(z.string()),
    banner: z.array(z.string()),
    thumb: z.array(z.string()),
  });
