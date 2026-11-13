import type { z } from 'zod';
import type { linkReportSchema } from './linkReportSchema.ts';

export type LinkReport = z.infer<typeof linkReportSchema>;
