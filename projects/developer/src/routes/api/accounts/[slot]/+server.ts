import { env } from '$env/dynamic/private';
import {
  accountCookie,
  isAccountSlot,
  OAUTH_STATE_COOKIE,
} from '$lib/server/accountCookie.ts';
import { assertSameOrigin } from '$lib/server/assertSameOrigin.ts';
import { readAccountSession } from '$lib/server/readAccountSession.ts';
import { revokeOAuthSession } from '$lib/server/traktOAuth.ts';
import { privateJson } from '$lib/server/privateJson.ts';
import { error, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async (
  { params, cookies, request, url },
) => {
  assertSameOrigin({ request, url });
  const slot = Number(params.slot);
  if (!isAccountSlot(slot)) error(400, 'Invalid account slot.');

  const session = await readAccountSession({ cookies, slot });
  cookies.delete(accountCookie(slot), {
    path: '/',
    secure: url.protocol === 'https:',
  });
  cookies.delete(OAUTH_STATE_COOKIE, {
    path: '/auth',
    secure: url.protocol === 'https:',
  });

  let revoked = !session;
  if (session && env.TRAKT_CLIENT_ID && env.TRAKT_CLIENT_SECRET) {
    revoked = await revokeOAuthSession({
      session,
      clientId: env.TRAKT_CLIENT_ID,
      clientSecret: env.TRAKT_CLIENT_SECRET,
    }).then(() => true, () => false);
  }

  return privateJson({ ok: true, revoked });
};
