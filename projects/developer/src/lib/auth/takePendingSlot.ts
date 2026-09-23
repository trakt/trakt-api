import { parseAccountSlot } from './parseAccountSlot.ts';
import { PENDING_SLOT_KEY } from './PENDING_SLOT_KEY.ts';
import { takeSessionValue } from './takeSessionValue.ts';

export function takePendingSlot(): number | null {
  return parseAccountSlot(takeSessionValue(PENDING_SLOT_KEY));
}
