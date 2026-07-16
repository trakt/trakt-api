import { z } from 'zod';
import { progressResponseSchema } from '../../../_internal/response/progressResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';

/** Zod schema for the up next response. */
export const upNextResponseSchema = z.object({
  show: showResponseSchema,
  progress: progressResponseSchema,
});
