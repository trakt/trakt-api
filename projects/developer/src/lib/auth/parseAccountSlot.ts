import { isAccountSlot } from './accountSlots.ts';

export function parseAccountSlot(value: string | null): number | null {
  if (value === null) return null;

  const slot = Number(value);
  return isAccountSlot(slot) ? slot : null;
}
