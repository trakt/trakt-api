import type { z } from 'zod';
import type { productionSignInSchema } from './productionSignInSchema.ts';

export type ProductionSignIn = z.infer<typeof productionSignInSchema>;
