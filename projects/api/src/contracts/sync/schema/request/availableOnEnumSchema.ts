import { asString, z } from '../../../_internal/z.ts';

/**
 * Zod schema for the `available_on` collection filter. `digital` keeps items
 * synced from a connected media server; `other` keeps everything else.
 */
export const availableOnEnumSchema = asString(z.enum([
  'digital',
  'other',
]));
