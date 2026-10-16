import { asString, z } from '../../../_internal/z.ts';

/**
 * Zod schema for available on enum. `digital` filters to items synced from a
 * connected media server; `plex` is the older name for the same filter.
 */
export const availableOnEnumSchema = asString(z.enum([
  'digital',
  'plex',
]));
