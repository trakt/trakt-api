import { asString, z } from '../../../_internal/z.ts';

/**
 * Zod schema for the source name in a collected item's `available_on`.
 * Synced items are labelled `plex`.
 */
export const availableOnNameResponseSchema = asString(
  z.enum(['digital', 'plex']),
);
