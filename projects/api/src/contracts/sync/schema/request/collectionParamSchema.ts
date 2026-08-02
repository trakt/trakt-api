import { z } from '../../../_internal/z.ts';
import { availableOnEnumSchema } from './availableOnEnumSchema.ts';

/** Zod schema for collection param. */
export const collectionParamSchema = z.object({
  available_on: availableOnEnumSchema.nullish(),
  start_at: z.string().nullish().openapi({
    description: 'Start date for the range. Must be formatted as "YYYY-MM-DD".',
  }),
  end_at: z.string().nullish().openapi({
    description: 'End date for the range. Must be formatted as "YYYY-MM-DD".',
  }),
  sync_id: z.number().int().nullish().openapi({
    description:
      'Restrict to items added by a specific data sync. Requires an Official-tier application.',
  }),
});
