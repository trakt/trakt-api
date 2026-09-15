import { takePendingSlot } from './pendingSlot.ts';
import { storeUsername } from './storeUsername.ts';
import { userManager } from './userManager.ts';

export async function completeSignIn(): Promise<void> {
  const slot = takePendingSlot();

  if (slot === null) {
    throw new Error('This sign-in could not be matched to an account.');
  }

  const user = await userManager(slot).signinRedirectCallback();
  await storeUsername(slot, user.access_token);
}
