import { reportRequestSchemaFactory } from '../../../_internal/request/reportRequestSchemaFactory.ts';

/** Zod schema for the user report request. */
export const userReportRequestSchema = reportRequestSchemaFactory(
  [
    'spam',
    'adult',
    'language',
    'other',
  ] as const,
);
