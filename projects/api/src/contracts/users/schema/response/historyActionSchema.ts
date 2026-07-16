import { z } from '../../../_internal/z.ts';

/** Zod schema for history action. */
export const historyActionSchema = z.enum(['scrobble', 'checkin', 'watch']);
