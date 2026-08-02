import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Recommended show response. */
export const recommendedShowResponse = z.array(showResponseSchema);
