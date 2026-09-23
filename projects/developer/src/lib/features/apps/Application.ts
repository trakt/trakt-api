import { z } from 'zod';
import { applicationSchema } from './applicationSchema.ts';

export type Application = z.infer<typeof applicationSchema>;
