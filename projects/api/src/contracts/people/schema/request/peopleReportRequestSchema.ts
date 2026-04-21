import { reportRequestSchemaFactory } from '../../../_internal/request/reportRequestSchemaFactory.ts';

export const peopleReportRequestSchema = reportRequestSchemaFactory(
  [
    'duplicate',
    'remove',
    'data_refresh',
    'metadata',
    'adult',
    'language',
    'spam',
    'tmdb',
    'other',
  ] as const,
);
