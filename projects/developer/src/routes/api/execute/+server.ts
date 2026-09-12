import { env } from '$env/dynamic/private';
import { assertSameOrigin } from '$lib/server/assertSameOrigin.ts';
import { readAccountSession } from '$lib/server/readAccountSession.ts';
import { redactResponse } from '$lib/server/redactResponse.ts';
import { privateJson } from '$lib/server/privateJson.ts';
import { error, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const ALLOWED_HOSTS = new Set([
  'api.trakt.tv',
  'apiz.trakt.tv',
  'auth.trakt.tv',
]);
const PROTECTED_REQUEST_HEADERS = new Set([
  'authorization',
  'proxy-authorization',
  'set-cookie',
  'cookie',
  'host',
  'origin',
  'referer',
  'trakt-api-key',
  'trakt-api-version',
  'user-agent',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-real-ip',
]);
const PRIVATE_RESPONSE_HEADERS = new Set([
  'authorization',
  'set-cookie',
  'proxy-authenticate',
  'www-authenticate',
]);
const MAX_REQUEST_BYTES = 1_000_000;
const MAX_RESPONSE_BYTES = 2_000_000;

const ExecutionSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  url: z.string().url(),
  headers: z.array(z.object({
    name: z.string().max(128),
    value: z.string().max(8_192),
    enabled: z.boolean(),
  })).max(100),
  body: z.string().max(MAX_REQUEST_BYTES),
  accountSlot: z.number().int().min(0).max(4).nullable(),
});

function safeHeaders(
  entries: ReadonlyArray<{ name: string; value: string; enabled: boolean }>,
): Headers {
  return entries.reduce((headers, entry) => {
    const name = entry.name.trim().toLocaleLowerCase();
    if (!entry.enabled || !name || PROTECTED_REQUEST_HEADERS.has(name)) {
      return headers;
    }

    headers.set(name, entry.value);
    return headers;
  }, new Headers());
}

function responseHeaders(headers: Headers) {
  return [...headers.entries()]
    .filter(([name]) => !PRIVATE_RESPONSE_HEADERS.has(name.toLocaleLowerCase()))
    .map(([name, value]) => ({ name, value }));
}

function formattedBody(bytes: Uint8Array): { body: string; isJson: boolean } {
  const text = new TextDecoder().decode(bytes);
  try {
    return { body: JSON.stringify(JSON.parse(text), null, 2), isJson: true };
  } catch {
    return { body: text, isJson: false };
  }
}

export const POST: RequestHandler = async (
  { request, cookies, fetch, url },
) => {
  assertSameOrigin({ request, url });
  if (!env.TRAKT_CLIENT_ID) error(503, 'The API client is not configured.');

  const parsed = ExecutionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) error(400, 'The request is invalid.');

  const target = new URL(parsed.data.url);
  if (
    target.protocol !== 'https:' || target.port ||
    !ALLOWED_HOSTS.has(target.hostname)
  ) {
    error(400, 'Only approved Trakt API hosts can be requested.');
  }

  if (target.username || target.password) {
    error(400, 'Credentials are not allowed in request URLs.');
  }

  const isOAuthEndpoint = target.hostname === 'auth.trakt.tv' ||
    /^\/oauth(?:\/|$)/.test(decodeURIComponent(target.pathname));
  const accountSlot = isOAuthEndpoint ? null : parsed.data.accountSlot;
  const oauthSession = accountSlot !== null
    ? await readAccountSession({ cookies, slot: accountSlot })
    : null;
  const accessToken = oauthSession?.accessToken;

  if (accountSlot !== null && !accessToken) {
    error(401, 'The selected account is unavailable.');
  }

  const headers = safeHeaders(parsed.data.headers);
  headers.set('accept', headers.get('accept') ?? 'application/json');
  headers.set('trakt-api-key', env.TRAKT_CLIENT_ID);
  headers.set('trakt-api-version', '2');
  headers.set('user-agent', 'TraktDeveloper/1.0.0');
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
  if (parsed.data.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const startedAt = performance.now();
  const response = await fetch(target, {
    method: parsed.data.method,
    headers,
    body: ['GET', 'DELETE'].includes(parsed.data.method) && !parsed.data.body
      ? undefined
      : parsed.data.body,
    redirect: 'manual',
    credentials: 'omit',
    signal: AbortSignal.timeout(30_000),
  }).catch(() => null);

  if (!response) error(502, 'The Trakt API request could not be completed.');

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_RESPONSE_BYTES) {
    error(502, 'The response exceeded the 2 MB developer limit.');
  }

  const formatted = formattedBody(new Uint8Array(buffer));
  const redacted = redactResponse({
    ...formatted,
    headers: responseHeaders(response.headers),
    secrets: [
      env.TRAKT_CLIENT_ID,
      env.TRAKT_CLIENT_SECRET,
      env.DEVELOPER_SESSION_SECRET,
      oauthSession?.accessToken,
      oauthSession?.refreshToken,
    ],
  });

  return privateJson({
    status: response.status,
    statusText: response.statusText,
    durationMs: Math.round((performance.now() - startedAt) * 10) / 10,
    size: buffer.byteLength,
    headers: redacted.headers,
    body: redacted.body,
    isJson: formatted.isJson,
  });
};
