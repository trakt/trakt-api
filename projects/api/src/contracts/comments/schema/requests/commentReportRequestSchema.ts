import { reportRequestSchemaFactory } from '../../../_internal/request/reportRequestSchemaFactory.ts';

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
