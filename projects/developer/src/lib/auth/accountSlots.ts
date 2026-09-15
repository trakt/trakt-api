export const ACCOUNT_LIMIT = 5;

export function isAccountSlot(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value < ACCOUNT_LIMIT;
}

export function fallbackUsername(slot: number): string {
  return `Account ${slot + 1}`;
}
