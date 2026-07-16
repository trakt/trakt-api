import { z } from '../../../_internal/z.ts';
import { availableOnEnumSchema } from './availableOnEnumSchema.ts';

/** Zod schema for collection param. */
export const collectionParamSchema = z.object({
  available_on: availableOnEnumSchema.nullish(),
});
