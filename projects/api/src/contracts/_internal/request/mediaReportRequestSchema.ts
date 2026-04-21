import { reportRequestSchemaFactory } from './reportRequestSchemaFactory.ts';

export const mediaReportRequestSchema = reportRequestSchemaFactory(
  [
    'duplicate',
    'remove',
    'data_refresh',
    'metadata',
    'adult',
    'runtime',
    'language',
    'spam',
    'tmdb',
    'other',
  ] as const,
);
