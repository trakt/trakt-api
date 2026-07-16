import { z } from '../../../_internal/z.ts';

/** Zod schema for the hidden show request. */
export const hiddenShowRequestSchema = z.object({ type: z.literal('show') });
