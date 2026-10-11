import { z } from '../../../_internal/z.ts';

/** Zod schema for the smart list drafts summary response. */
export const smartListDraftsSummaryResponseSchema = z.object({
  convertible_count: z.number().int(),
  best_confidence: z.number().nullable(),
  lists: z.object({
    ids: z.object({
      trakt: z.number().int(),
      slug: z.string(),
    }),
    name: z.string().nullable(),
    item_count: z.number().int().nullable(),
    confidence: z.number(),
  }).array(),
});
