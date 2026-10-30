import { historyItemsRequestSchema } from '../../../_internal/request/historyItemsRequestSchema.ts';
import { historyIdsRequestSchema } from './historyIdsRequestSchema.ts';

/** Zod schema for the history remove request. */
export const historyRemoveRequestSchema = historyItemsRequestSchema.merge(
  historyIdsRequestSchema,
);
