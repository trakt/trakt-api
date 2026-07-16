import { reportRequestSchemaFactory } from './reportRequestSchemaFactory.ts';

/** Zod schema for the media report request. */
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
