import { reportRequestSchemaFactory } from '../../../_internal/request/reportRequestSchemaFactory.ts';

/** Zod schema for the people report request. */
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
