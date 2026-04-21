import { reportRequestSchemaFactory } from '../../_internal/request/reportRequestSchemaFactory.ts';

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
