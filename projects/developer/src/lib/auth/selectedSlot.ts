import { ACTIVE_SLOT } from './ACTIVE_SLOT.ts';
import { parseAccountSlot } from './parseAccountSlot.ts';

export function selectedSlot(): number | null {
  return parseAccountSlot(
    globalThis.sessionStorage?.getItem(ACTIVE_SLOT) ?? null,
  );
}
