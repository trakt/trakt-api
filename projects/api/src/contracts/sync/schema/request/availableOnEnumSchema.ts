import { asString, z } from '../../../_internal/z.ts';

/** Zod schema for available on enum. */
export const availableOnEnumSchema = asString(z.enum([
  'plex',
]));
