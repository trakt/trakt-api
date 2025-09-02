import { z } from '../../../_internal/z.ts';

export const historyActionSchema = z.enum(['scrobble', 'checkin', 'watch']);
