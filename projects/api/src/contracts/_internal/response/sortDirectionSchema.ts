import { z } from '../z.ts';

/** Zod schema for sort direction. */
export const sortDirectionSchema = z.enum(['asc', 'desc']);
