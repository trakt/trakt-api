import { addMember } from './addMember.ts';
import type { AppMember } from './AppMember.ts';
import type { AppMemberRole } from './AppMemberRole.ts';
import type { MemberTarget } from './MemberTarget.ts';
import { removeMember } from './removeMember.ts';

export async function changeMemberRole(
  target: MemberTarget,
  member: AppMember,
  role: AppMemberRole,
): Promise<void> {
  if (role === member.role) return;
  if (role === 'manager') return addMember(target, member.slug, 'manager');
  await removeMember(target, member);
  try {
    await addMember(target, member.slug, 'tester');
  } catch (cause) {
    await addMember(target, member.slug, 'manager');
    throw cause;
  }
}
