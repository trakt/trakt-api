import { rememberSection } from './rememberSection.ts';
import { writePendingSlot } from './writePendingSlot.ts';
import { userManager } from './userManager.ts';

export async function signInAccount(slot: number): Promise<void> {
  const manager = userManager(slot);
  const promptLogin = slot > 0 || Boolean(await manager.getUser());

  writePendingSlot(slot);
  rememberSection();

  await manager.signinRedirect(
    promptLogin ? { extraQueryParams: { prompt: 'login' } } : {},
  );
}
