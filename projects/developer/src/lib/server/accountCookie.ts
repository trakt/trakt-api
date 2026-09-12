const COOKIE_PREFIX = 'trakt-developer-account-';
export const ACCOUNT_LIMIT = 5;

export function accountCookie(slot: number): string {
  return `${COOKIE_PREFIX}${slot}`;
}

export function isAccountSlot(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value < ACCOUNT_LIMIT;
}

export const OAUTH_STATE_COOKIE = 'trakt-developer-oauth-state';
