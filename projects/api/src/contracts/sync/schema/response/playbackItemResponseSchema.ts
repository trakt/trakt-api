import { float, int64, z } from '../../../_internal/z.ts';

/** Zod schema for the fields shared by every playback progress item. */
export const playbackItemResponseSchema = z.object({
  progress: float(z.number().min(0).max(100)),
  paused_at: z.string().datetime(),
  id: int64(z.number().int()),
});
