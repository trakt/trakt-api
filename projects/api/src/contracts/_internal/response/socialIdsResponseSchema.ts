import { z } from '../z.ts';

/** Zod schema for the social ids response. */
export const socialIdsResponseSchema = z.object({
  twitter: z.string().nullish(),
  facebook: z.string().nullish(),
  instagram: z.string().nullish(),
  wikipedia: z.string().nullish(),
});
