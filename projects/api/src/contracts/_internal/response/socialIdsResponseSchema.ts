import { z } from '../z.ts';

export const socialIdsResponseSchema = z.object({
  twitter: z.string().nullish(),
  facebook: z.string().nullish(),
  instagram: z.string().nullish(),
  wikipedia: z.string().nullish(),
});
