import type { z } from 'zod';
import type { applicationProfileSchema } from './applicationProfileSchema.ts';

export type ApplicationProfile = z.infer<typeof applicationProfileSchema>;
