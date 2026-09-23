import { usernameKey } from './usernameKey.ts';

export function writeUsername(slot: number, username: string): void {
  globalThis.localStorage?.setItem(usernameKey(slot), username);
}
