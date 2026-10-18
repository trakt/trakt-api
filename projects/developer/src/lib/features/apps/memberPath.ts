import type { AppMemberRole } from './AppMemberRole.ts';

const ROLE_SEGMENT: Record<AppMemberRole, string> = {
  manager: 'managers',
  tester: 'allowed-users',
};

export function memberPath({
  appId,
  role,
  username,
}: {
  appId: number;
  role: AppMemberRole;
  username: string;
}): string {
  return `/v3/users/me/applications/${appId}/${ROLE_SEGMENT[role]}/${encodeURIComponent(
    username,
  )}`;
}
