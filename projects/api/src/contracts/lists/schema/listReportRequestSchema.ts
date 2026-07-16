import { reportRequestSchemaFactory } from '../../_internal/request/reportRequestSchemaFactory.ts';

/** Zod schema for the list report request. */
export const listReportRequestSchema = reportRequestSchemaFactory(
  [
    'duplicate',
    'remove',
    'metadata',
    'adult',
    'language',
    'spam',
    'other',
  ] as const,
);
