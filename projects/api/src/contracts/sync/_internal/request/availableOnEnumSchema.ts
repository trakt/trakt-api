import { asString, z } from '../../../_internal/z.ts';

export const availableOnEnumSchema = asString(z.enum([
  'plex',
]));
