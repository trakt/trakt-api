import { PENDING_SLOT_KEY } from './PENDING_SLOT_KEY.ts';

export function writePendingSlot(slot: number): void {
  globalThis.sessionStorage?.setItem(PENDING_SLOT_KEY, String(slot));
}
