import { smartListFiltersSchema } from '../../../_internal/request/smartListFiltersSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the smart list draft response. */
export const smartListDraftResponseSchema = z.object({
  list: z.object({
    ids: z.object({
      trakt: z.number().int(),
      slug: z.string(),
    }),
  }),
  origin_url: z.string().nullable(),
  source: z.string(),
  media_type: z.string(),
  filters: smartListFiltersSchema,
  unsupported: z.string().array(),
  confidence: z.number(),
  converted: z
    .object({
      smart_list_id: z.number().int(),
      converted_at: z.string().datetime(),
    })
    .nullable(),
});
