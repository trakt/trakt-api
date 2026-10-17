import { z } from 'zod';
import { managersSchema } from './managersSchema.ts';

export type AppManager = z.infer<typeof managersSchema>['managers'][number];
