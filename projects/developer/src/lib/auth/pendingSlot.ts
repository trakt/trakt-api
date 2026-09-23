import { parseAccountSlot } from './parseAccountSlot.ts';

const PENDING_SLOT_KEY = 'trakt-developer-pending-slot';

export function writePendingSlot(slot: number): void {
  globalThis.sessionStorage?.setItem(PENDING_SLOT_KEY, String(slot));
}

export function takePendingSlot(): number | null {
  const stored = globalThis.sessionStorage?.getItem(PENDING_SLOT_KEY) ?? null;
  globalThis.sessionStorage?.removeItem(PENDING_SLOT_KEY);

  return parseAccountSlot(stored);
}
