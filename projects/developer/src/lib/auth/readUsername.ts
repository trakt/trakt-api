import { fallbackUsername } from './fallbackUsername.ts';
import { usernameKey } from './usernameKey.ts';

export function readUsername(slot: number): string {
  return globalThis.localStorage?.getItem(usernameKey(slot)) ||
    fallbackUsername(slot);
}
