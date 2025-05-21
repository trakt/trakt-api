import { z } from '../z.ts';

export const listMetadataResponseSchema = z.object({
  rank: z.number().int(),
  id: z.number().int(),
  listed_at: z.string().datetime(),
  notes: z.string().nullable(),
});
