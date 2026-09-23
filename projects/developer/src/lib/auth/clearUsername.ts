import { usernameKey } from './usernameKey.ts';

export function clearUsername(slot: number): void {
  globalThis.localStorage?.removeItem(usernameKey(slot));
}
