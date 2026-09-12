import { env } from '$env/dynamic/private';
import {
  isAccountSlot,
  OAUTH_STATE_COOKIE,
} from '$lib/server/accountCookie.ts';
import { oauthRedirectUri } from '$lib/server/oauthRedirectUri.ts';
import { writeAccountSession } from '$lib/server/writeAccountSession.ts';
import { exchangeOAuthCode } from '$lib/server/traktOAuth.ts';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, cookies }) => {
  if (
    !env.TRAKT_CLIENT_ID || !env.TRAKT_CLIENT_SECRET ||
    !env.DEVELOPER_SESSION_SECRET
  ) {
    error(503, 'OAuth is not configured.');
  }

  const storedState = cookies.get(OAUTH_STATE_COOKIE);
  cookies.delete(OAUTH_STATE_COOKIE, {
    path: '/auth',
    secure: url.protocol === 'https:',
  });

  const parsed = storedState
    ? JSON.parse(storedState) as { state?: unknown; slot?: unknown }
    : null;
  const slot = typeof parsed?.slot === 'number' ? parsed.slot : -1;
  const receivedState = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (
    typeof parsed?.state !== 'string' || parsed.state !== receivedState ||
    !isAccountSlot(slot) || !code
  ) {
    error(400, 'The OAuth callback could not be verified.');
  }

  const session = await exchangeOAuthCode({
    code,
    clientId: env.TRAKT_CLIENT_ID,
    clientSecret: env.TRAKT_CLIENT_SECRET,
    redirectUri: oauthRedirectUri({ requestUrl: url }),
    fallbackUsername: `Account ${slot + 1}`,
  });

  await writeAccountSession({
    cookies,
    slot,
    session: session,
    secret: env.DEVELOPER_SESSION_SECRET,
    requestUrl: url,
  });

  redirect(303, '/');
};
