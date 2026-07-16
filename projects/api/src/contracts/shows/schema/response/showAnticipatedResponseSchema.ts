import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the show anticipated response. */
export const showAnticipatedResponseSchema = z.object({
  list_count: z.number().int(),
  show: showResponseSchema,
});
