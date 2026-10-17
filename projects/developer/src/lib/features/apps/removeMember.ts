import type { AppMember } from './AppMember.ts';
import type { MemberTarget } from './MemberTarget.ts';
import { removeAllowedUser } from './removeAllowedUser.ts';
import { removeManager } from './removeManager.ts';

export function removeMember(
  { slot, appId }: MemberTarget,
  member: AppMember,
): Promise<void> {
  return member.role === 'manager'
    ? removeManager(slot, appId, member.slug)
    : removeAllowedUser(slot, appId, member.slug);
}
