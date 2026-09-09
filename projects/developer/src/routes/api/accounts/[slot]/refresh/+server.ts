import { env } from '$env/dynamic/private';
import { isAccountSlot } from '$lib/server/accountCookie.ts';
import { assertSameOrigin } from '$lib/server/assertSameOrigin.ts';
import { oauthRedirectUri } from '$lib/server/oauthRedirectUri.ts';
import { readAccountSession } from '$lib/server/readAccountSession.ts';
import { writeAccountSession } from '$lib/server/writeAccountSession.ts';
import { refreshOAuthSession } from '$lib/server/traktOAuth.ts';
import { privateJson } from '$lib/server/privateJson.ts';
import { error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (
  { params, cookies, url, request },
) => {
  assertSameOrigin({ request, url });
  const slot = Number(params.slot);
  if (!isAccountSlot(slot)) error(400, 'Invalid account slot.');
  if (
    !env.TRAKT_CLIENT_ID || !env.TRAKT_CLIENT_SECRET ||
    !env.DEVELOPER_SESSION_SECRET
  ) {
    error(503, 'OAuth is not configured.');
  }

  const session = await readAccountSession({ cookies, slot });
  if (!session) error(404, 'Account not found.');

  const refreshed = await refreshOAuthSession({
    session,
    clientId: env.TRAKT_CLIENT_ID,
    clientSecret: env.TRAKT_CLIENT_SECRET,
    redirectUri: oauthRedirectUri({ requestUrl: url }),
  }).catch(() =>
    error(
      502,
      'Could not refresh the access token. Reconnect your account or try again.',
    )
  );

  await writeAccountSession({
    cookies,
    slot,
    session: refreshed,
    secret: env.DEVELOPER_SESSION_SECRET,
    requestUrl: url,
  });

  return privateJson({ ok: true });
};
