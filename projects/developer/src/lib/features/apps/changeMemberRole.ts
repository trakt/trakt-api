import { addAllowedUser } from './addAllowedUser.ts';
import { addManager } from './addManager.ts';
import type { AppMember } from './AppMember.ts';
import type { AppMemberRole } from './AppMemberRole.ts';
import type { MemberTarget } from './MemberTarget.ts';
import { removeManager } from './removeManager.ts';

export async function changeMemberRole(
  { slot, appId }: MemberTarget,
  member: AppMember,
  role: AppMemberRole,
): Promise<void> {
  if (role === member.role) return;
  if (role === 'manager') return addManager(slot, appId, member.slug);
  await removeManager(slot, appId, member.slug);
  try {
    await addAllowedUser(slot, appId, member.slug);
  } catch (cause) {
    await addManager(slot, appId, member.slug);
    throw cause;
  }
}
