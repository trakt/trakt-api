import { storeUsername } from './storeUsername.ts';
import { userManager } from './userManager.ts';

export async function refreshAccount(slot: number): Promise<void> {
  const user = await userManager(slot).signinSilent();

  if (!user) throw new Error('Trakt did not return a new access token.');

  await storeUsername(slot, user.access_token);
}
