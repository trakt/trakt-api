import { z } from 'zod';

export const productionStatusSchema = z.enum([
  'pending',
  'changes_requested',
  'granted',
  'granted_instantly',
  'declined',
  'suspended',
]);
