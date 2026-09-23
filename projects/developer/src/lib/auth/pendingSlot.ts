import { parseAccountSlot } from './parseAccountSlot.ts';
import { takeSessionValue } from './takeSessionValue.ts';

const PENDING_SLOT_KEY = 'trakt-developer-pending-slot';

export function writePendingSlot(slot: number): void {
  globalThis.sessionStorage?.setItem(PENDING_SLOT_KEY, String(slot));
}

export function takePendingSlot(): number | null {
  return parseAccountSlot(takeSessionValue(PENDING_SLOT_KEY));
}
