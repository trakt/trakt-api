import { rememberSection } from './rememberSection.ts';
import { writePendingSlot } from './writePendingSlot.ts';
import { userManager } from './userManager.ts';

export async function signInAccount(slot: number): Promise<void> {
  writePendingSlot(slot);
  rememberSection();

  await userManager(slot).signinRedirect(
    slot > 0 ? { extraQueryParams: { prompt: 'login' } } : {},
  );
}
