import { isAccountSlot } from './isAccountSlot.ts';

export async function withAccountLock<T>(
  slot: number,
  operation: () => Promise<T>,
): Promise<T> {
  if (!isAccountSlot(slot)) {
    throw new Error('The selected account is unavailable.');
  }

  if (!globalThis.navigator?.locks) {
    throw new Error(
      'Safe account access requires a browser with Web Locks support.',
    );
  }

  return globalThis.navigator.locks.request(
    `trakt-developer-account-${slot}`,
    operation,
  );
}
