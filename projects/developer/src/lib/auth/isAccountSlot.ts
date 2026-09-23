import { ACCOUNT_LIMIT } from './ACCOUNT_LIMIT.ts';

export function isAccountSlot(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value < ACCOUNT_LIMIT;
}
