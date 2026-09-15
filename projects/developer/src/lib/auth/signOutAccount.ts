import { clearUsername } from './accountUsername.ts';
import { userManager } from './userManager.ts';

export async function signOutAccount(slot: number): Promise<void> {
  const manager = userManager(slot);

  // Trakt's revocation endpoint may reject a public client, and the local
  // tokens must be cleared either way.
  await manager.revokeTokens(['access_token', 'refresh_token']).catch(() => {});
  await manager.removeUser();
  clearUsername(slot);
}
