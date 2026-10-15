import { z } from 'zod';
import { pendingCheckoutSchema } from './pendingCheckoutSchema.ts';

export type PendingCheckout = z.infer<typeof pendingCheckoutSchema>;
