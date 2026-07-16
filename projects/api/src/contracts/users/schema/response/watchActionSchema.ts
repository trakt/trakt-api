import { z } from '../../../_internal/z.ts';

/** Zod schema for watch action. */
export const watchActionSchema = z.enum(['now', 'ask', 'released', 'unknown']);
