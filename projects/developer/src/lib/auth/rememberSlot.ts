import { ACTIVE_SLOT } from './ACTIVE_SLOT.ts';

export function rememberSlot(slot: number): void {
  globalThis.sessionStorage?.setItem(ACTIVE_SLOT, String(slot));
}
