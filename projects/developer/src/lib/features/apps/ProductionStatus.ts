import type { z } from 'zod';
import type { productionStatusSchema } from './productionStatusSchema.ts';

export type ProductionStatus = z.infer<typeof productionStatusSchema>;
