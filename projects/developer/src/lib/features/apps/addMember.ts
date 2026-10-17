import { addAllowedUser } from './addAllowedUser.ts';
import { addManager } from './addManager.ts';
import type { AppMemberRole } from './AppMemberRole.ts';
import type { MemberTarget } from './MemberTarget.ts';

export function addMember(
  { slot, appId }: MemberTarget,
  username: string,
  role: AppMemberRole,
): Promise<void> {
  return role === 'manager'
    ? addManager(slot, appId, username)
    : addAllowedUser(slot, appId, username);
}
