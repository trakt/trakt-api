import { fallbackUsername } from './accountSlots.ts';

const USERNAME_PREFIX = 'trakt-developer-username-';

function key(slot: number): string {
  return `${USERNAME_PREFIX}${slot}`;
}

export function readUsername(slot: number): string {
  return globalThis.localStorage?.getItem(key(slot)) || fallbackUsername(slot);
}

export function writeUsername(slot: number, username: string): void {
  globalThis.localStorage?.setItem(key(slot), username);
}

export function clearUsername(slot: number): void {
  globalThis.localStorage?.removeItem(key(slot));
}
