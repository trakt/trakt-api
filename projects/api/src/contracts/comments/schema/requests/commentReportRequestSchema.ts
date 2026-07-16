import { reportRequestSchemaFactory } from '../../../_internal/request/reportRequestSchemaFactory.ts';

/** Zod schema for the comment report request. */
export const commentReportRequestSchema = reportRequestSchemaFactory(
  [
    'spoilers',
    'language',
    'abusive',
    'spam',
    'bigotry',
    'political',
    'offtopic',
    'support',
    'duplicate',
    'too_short',
    'other',
  ] as const,
);
