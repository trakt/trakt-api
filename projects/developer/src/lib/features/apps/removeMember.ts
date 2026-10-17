import { accountRequest } from '$lib/api/accountRequest.ts';
import type { AppMember } from './AppMember.ts';
import { memberPath } from './memberPath.ts';
import type { MemberTarget } from './MemberTarget.ts';

export async function removeMember(
  { slot, appId }: MemberTarget,
  member: AppMember,
): Promise<void> {
  await accountRequest({
    slot,
    path: memberPath({ appId, role: member.role, username: member.slug }),
    init: { method: 'DELETE' },
  });
}
