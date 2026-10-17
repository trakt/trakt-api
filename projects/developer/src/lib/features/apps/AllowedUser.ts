import { z } from 'zod';
import { allowedUsersSchema } from './allowedUsersSchema.ts';

export type AllowedUser = z.infer<typeof allowedUsersSchema>['users'][number];
