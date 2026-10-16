import { smartListFiltersSchema } from '../request/smartListFiltersSchema.ts';
import { smartListItemResponseSchema } from './smartListItemResponseSchema.ts';
import { z } from '../z.ts';

/** Zod schema for the smart list template response. */
export const smartListTemplateResponseSchema = z.object({
  id: z.string(),
  source: z.string(),
  media_type: z.string(),
  filters: smartListFiltersSchema,
  personal: z.boolean(),
  total: z.number().int().nullish(),
  items: smartListItemResponseSchema.array(),
});
