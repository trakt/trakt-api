import { writePendingSlot } from './pendingSlot.ts';
import { userManager } from './userManager.ts';

export async function signInAccount(slot: number): Promise<void> {
  writePendingSlot(slot);

  await userManager(slot).signinRedirect(
    slot > 0 ? { extraQueryParams: { prompt: 'login' } } : {},
  );
}
