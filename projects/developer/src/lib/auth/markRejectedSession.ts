import type { UserManager } from 'oidc-client-ts';
import { accountSessionErrors } from './accountSessionErrors.ts';
import { userManager } from './userManager.ts';
import { withAccountLock } from './withAccountLock.ts';

export async function markRejectedSession({
  slot,
  accessToken,
  manager = userManager,
  lock = withAccountLock,
  mark = accountSessionErrors.mark,
}: {
  slot: number;
  accessToken: string;
  manager?: (slot: number) => Pick<UserManager, 'getUser'>;
  lock?: typeof withAccountLock;
  mark?: (slot: number) => void;
}): Promise<void> {
  await lock(slot, async () => {
    const user = await manager(slot).getUser();
    if (user?.access_token === accessToken) mark(slot);
  });
}
