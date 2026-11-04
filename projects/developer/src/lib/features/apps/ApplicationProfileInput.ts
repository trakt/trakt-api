import type { ApplicationProfile } from './ApplicationProfile.ts';

export type ApplicationProfileInput = Omit<
  ApplicationProfile,
  'updated_at' | 'updated_by'
>;
