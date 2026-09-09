import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { accountCookie, isAccountSlot } from './accountCookie.ts';
import type { OAuthSession } from './OAuthSession.ts';
import { decryptSession } from './sessionCipher.ts';

export function readAccountSession({
  cookies,
  slot,
}: {
  cookies: Cookies;
  slot: number;
}): Promise<OAuthSession | null> {
  if (!isAccountSlot(slot) || !env.DEVELOPER_SESSION_SECRET) {
    return Promise.resolve(null);
  }

  const value = cookies.get(accountCookie(slot));
  if (!value) return Promise.resolve(null);
  return decryptSession({ value, secret: env.DEVELOPER_SESSION_SECRET });
}
