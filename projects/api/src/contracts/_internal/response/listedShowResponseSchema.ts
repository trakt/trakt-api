import { listMetadataResponseSchema } from './listMetadataResponseSchema.ts';
import { typedShowResponseSchema } from './showResponseSchema.ts';

/** Zod schema for the listed show response. */
export const listedShowResponseSchema = listMetadataResponseSchema
  .merge(typedShowResponseSchema);
