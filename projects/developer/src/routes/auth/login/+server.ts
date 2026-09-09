import { env } from '$env/dynamic/private';
import {
  isAccountSlot,
  OAUTH_STATE_COOKIE,
} from '$lib/server/accountCookie.ts';
import { oauthRedirectUri } from '$lib/server/oauthRedirectUri.ts';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url, cookies }) => {
  if (
    !env.TRAKT_CLIENT_ID || !env.TRAKT_CLIENT_SECRET ||
    (env.DEVELOPER_SESSION_SECRET?.length ?? 0) < 32
  ) {
    error(
      503,
      'Configure the developer OAuth credentials and session secret.',
    );
  }

  const slot = Number(url.searchParams.get('slot') ?? 0);
  if (!isAccountSlot(slot)) error(400, 'Invalid account slot.');

  const state = crypto.randomUUID();
  const redirectUri = oauthRedirectUri({ requestUrl: url });
  cookies.set(OAUTH_STATE_COOKIE, JSON.stringify({ state, slot }), {
    path: '/auth',
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax',
    maxAge: 10 * 60,
  });

  const authorizationUrl = new URL('https://auth.trakt.tv/oauth/authorize');
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('client_id', env.TRAKT_CLIENT_ID);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('state', state);
  if (slot > 0) authorizationUrl.searchParams.set('prompt', 'login');

  redirect(302, authorizationUrl);
};
