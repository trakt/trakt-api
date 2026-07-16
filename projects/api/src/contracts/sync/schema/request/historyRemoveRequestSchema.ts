import { bulkMediaRequestSchema } from '../../../_internal/request/bulkMediaRequestSchema.ts';
import { historyIdsRequestSchema } from './historyIdsRequestSchema.ts';

/** Zod schema for the history remove request. */
export const historyRemoveRequestSchema = bulkMediaRequestSchema
  .merge(historyIdsRequestSchema);
