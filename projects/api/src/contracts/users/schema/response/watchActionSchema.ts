import { z } from '../../../_internal/z.ts';

export const watchActionSchema = z.enum(['now', 'ask', 'released']);
