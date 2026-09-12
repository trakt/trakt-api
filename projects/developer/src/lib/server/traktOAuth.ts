import type { OAuthSession } from './OAuthSession.ts';

const TOKEN_URL = 'https://auth.trakt.tv/oauth/token';
const REVOKE_URL = 'https://auth.trakt.tv/oauth/revoke';

type TokenPayload = {
  access_token?: unknown;
  refresh_token?: unknown;
  token_type?: unknown;
  scope?: unknown;
  created_at?: unknown;
  expires_in?: unknown;
};

function toString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

async function tokenRequest(
  body: Record<string, string>,
): Promise<TokenPayload> {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'TraktDeveloper/1.0.0',
    },
    body: JSON.stringify(body),
    redirect: 'error',
  });

  if (!response.ok) {
    throw new Error(`Trakt rejected the OAuth request (${response.status}).`);
  }

  return await response.json() as TokenPayload;
}

async function fetchUsername({
  accessToken,
  clientId,
  fallback,
}: {
  accessToken: string;
  clientId: string;
  fallback: string;
}): Promise<string> {
  const response = await fetch('https://api.trakt.tv/users/settings', {
    headers: {
      authorization: `Bearer ${accessToken}`,
      'trakt-api-key': clientId,
      'trakt-api-version': '2',
      'user-agent': 'TraktDeveloper/1.0.0',
    },
    redirect: 'error',
  });

  if (!response.ok) return fallback;

  const body = await response.json().catch(() => null) as {
    user?: { username?: unknown };
  } | null;
  return toString(body?.user?.username, fallback);
}

async function toSession({
  payload,
  clientId,
  fallbackUsername,
}: {
  payload: TokenPayload;
  clientId: string;
  fallbackUsername: string;
}): Promise<OAuthSession> {
  const accessToken = toString(payload.access_token);
  const refreshToken = toString(payload.refresh_token);

  if (!accessToken || !refreshToken) {
    throw new Error('Trakt returned an incomplete OAuth token response.');
  }

  const createdAt = toNumber(payload.created_at, Math.floor(Date.now() / 1000));
  const expiresIn = toNumber(payload.expires_in, 7_776_000);
  const username = await fetchUsername({
    accessToken,
    clientId,
    fallback: fallbackUsername,
  });

  return {
    accessToken,
    refreshToken,
    tokenType: toString(payload.token_type, 'bearer'),
    scope: toString(payload.scope, 'public'),
    createdAt,
    expiresAt: createdAt + expiresIn,
    username,
  };
}

export async function exchangeOAuthCode({
  code,
  clientId,
  clientSecret,
  redirectUri,
  fallbackUsername,
}: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  fallbackUsername: string;
}): Promise<OAuthSession> {
  const payload = await tokenRequest({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  return toSession({ payload, clientId, fallbackUsername });
}

export async function refreshOAuthSession({
  session,
  clientId,
  clientSecret,
  redirectUri,
}: {
  session: OAuthSession;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<OAuthSession> {
  const payload = await tokenRequest({
    refresh_token: session.refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'refresh_token',
  });

  return toSession({
    payload,
    clientId,
    fallbackUsername: session.username,
  });
}

export async function revokeOAuthSession({
  session,
  clientId,
  clientSecret,
}: {
  session: OAuthSession;
  clientId: string;
  clientSecret: string;
}): Promise<void> {
  const response = await fetch(REVOKE_URL, {
    method: 'POST',
    signal: AbortSignal.timeout(5_000),
    headers: {
      'content-type': 'application/json',
      'user-agent': 'TraktDeveloper/1.0.0',
    },
    body: JSON.stringify({
      token: session.accessToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
    redirect: 'error',
  });

  if (!response.ok) {
    throw new Error(`Trakt rejected token revocation (${response.status}).`);
  }
}
