import { accountRequest } from '$lib/api/accountRequest.ts';
import type { AppMemberRole } from './AppMemberRole.ts';
import { memberPath } from './memberPath.ts';
import type { MemberTarget } from './MemberTarget.ts';

export async function addMember(
  { slot, appId }: MemberTarget,
  username: string,
  role: AppMemberRole,
): Promise<void> {
  await accountRequest({
    slot,
    path: memberPath({ appId, role, username }),
    init: { method: 'POST' },
  });
}
