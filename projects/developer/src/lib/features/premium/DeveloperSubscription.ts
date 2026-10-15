import { z } from 'zod';
import { developerSubscriptionSchema } from './developerSubscriptionSchema.ts';

export type DeveloperSubscription = z.infer<typeof developerSubscriptionSchema>;
