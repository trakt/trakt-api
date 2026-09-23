const USERNAME_PREFIX = 'trakt-developer-username-';

export function usernameKey(slot: number): string {
  return `${USERNAME_PREFIX}${slot}`;
}
