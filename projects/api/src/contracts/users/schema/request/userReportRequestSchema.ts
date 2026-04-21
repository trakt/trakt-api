import { reportRequestSchemaFactory } from '../../../_internal/request/reportRequestSchemaFactory.ts';

export const userReportRequestSchema = reportRequestSchemaFactory(
  [
    'spam',
    'adult',
    'language',
    'other',
  ] as const,
);
