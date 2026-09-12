import type { Cookies } from '@sveltejs/kit';
import { accountCookie } from './accountCookie.ts';
import type { OAuthSession } from './OAuthSession.ts';
import { encryptSession } from './sessionCipher.ts';

const SESSION_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

export async function writeAccountSession({
  cookies,
  slot,
  session,
  secret,
  requestUrl,
}: {
  cookies: Cookies;
  slot: number;
  session: OAuthSession;
  secret: string;
  requestUrl: URL;
}): Promise<void> {
  cookies.set(accountCookie(slot), await encryptSession({ session, secret }), {
    path: '/',
    httpOnly: true,
    secure: requestUrl.protocol === 'https:',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}
