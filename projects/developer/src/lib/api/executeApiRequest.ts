import { PUBLIC_TRAKT_CLIENT_ID } from '$env/static/public';
import { markRejectedSession } from '$lib/auth/markRejectedSession.ts';
import { accessToken } from '$lib/auth/accessToken.ts';
import type { ApiExecutionRequest } from './ApiExecutionRequest.ts';
import type { ApiExecutionResponse } from './ApiExecutionResponse.ts';
import { redactResponse } from './redactResponse.ts';
import { traktHeaders } from './traktHeaders.ts';

const ALLOWED_HOSTS = new Set([
  'api.trakt.tv',
  'apiz.trakt.tv',
  'auth.trakt.tv',
]);

const MANAGED_REQUEST_HEADERS = new Set([
  'authorization',
  'trakt-api-key',
  'trakt-api-version',
]);

const MAX_RESPONSE_BYTES = 2_000_000;
const REQUEST_TIMEOUT_MS = 30_000;

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function targetUrl(value: string): URL {
  const target = parseUrl(value);

  if (
    !target || target.protocol !== 'https:' || target.port ||
    !ALLOWED_HOSTS.has(target.hostname)
  ) {
    throw new Error('Only approved Trakt API hosts can be requested.');
  }

  if (target.username || target.password) {
    throw new Error('Credentials are not allowed in request URLs.');
  }

  return target;
}

function requestHeaders(
  entries: ApiExecutionRequest['headers'],
): Headers {
  return entries.reduce((headers, entry) => {
    const name = entry.name.trim().toLocaleLowerCase();

    if (!entry.enabled || !name || MANAGED_REQUEST_HEADERS.has(name)) {
      return headers;
    }

    headers.set(name, entry.value);
    return headers;
  }, new Headers());
}

function formattedBody(text: string): { body: string; isJson: boolean } {
  try {
    return { body: JSON.stringify(JSON.parse(text), null, 2), isJson: true };
  } catch {
    return { body: text, isJson: false };
  }
}

export async function executeApiRequest(
  request: ApiExecutionRequest,
): Promise<ApiExecutionResponse> {
  const target = targetUrl(request.url);
  const isOAuthEndpoint = target.hostname === 'auth.trakt.tv' ||
    /^\/oauth(?:\/|$)/.test(decodeURIComponent(target.pathname));
  const slot = isOAuthEndpoint ? null : request.accountSlot;
  const token = slot === null ? null : await accessToken(slot);

  if (slot !== null && !token) {
    throw new Error('The selected account is unavailable.');
  }

  const headers = traktHeaders({
    accessToken: token,
    base: requestHeaders(request.headers),
  });
  if (request.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const startedAt = performance.now();
  const response = await fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'DELETE'].includes(request.method) && !request.body
      ? undefined
      : request.body,
    credentials: 'omit',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  }).catch(() => null);

  if (!response) {
    throw new Error('The Trakt API request could not be completed.');
  }

  if (response.status === 401 && slot !== null && token) {
    await markRejectedSession({ slot, accessToken: token });
  }

  const text = await response.text();
  const size = new TextEncoder().encode(text).length;

  if (size > MAX_RESPONSE_BYTES) {
    throw new Error('The response exceeded the 2 MB developer limit.');
  }

  const formatted = formattedBody(text);
  const redacted = redactResponse({
    ...formatted,
    headers: [...response.headers.entries()].map(([name, value]) => ({
      name,
      value,
    })),
    secrets: [PUBLIC_TRAKT_CLIENT_ID, token ?? undefined],
  });

  return {
    status: response.status,
    statusText: response.statusText,
    durationMs: Math.round((performance.now() - startedAt) * 10) / 10,
    size,
    headers: redacted.headers,
    body: redacted.body,
    isJson: formatted.isJson,
  };
}
