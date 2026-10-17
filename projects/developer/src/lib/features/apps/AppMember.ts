import type { AppMemberRole } from './AppMemberRole.ts';

export type AppMember = {
  username: string;
  slug: string;
  role: AppMemberRole;
  addedAt: string;
};
