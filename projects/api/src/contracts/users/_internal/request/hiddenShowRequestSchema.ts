import { z } from '../../../_internal/z.ts';

export const hiddenShowRequestSchema = z.object({ type: z.literal('show') });
