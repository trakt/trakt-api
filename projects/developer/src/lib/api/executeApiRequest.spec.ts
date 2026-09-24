import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { executeApiRequest } from './executeApiRequest.ts';
import { accessToken } from '$lib/auth/accessToken.ts';

vi.mock('$lib/auth/accessToken.ts', () => ({ accessToken: vi.fn() }));

const BASE = {
  method: 'GET',
  url: 'https://api.trakt.tv/movies/trending',
  headers: [],
  body: '',
  accountSlot: null,
} as const;

function respondWith(body: string, init?: ResponseInit) {
  const fetch = vi.fn().mockResolvedValue(new Response(body, init));
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

function sentHeaders(fetch: ReturnType<typeof vi.fn>): Headers {
  const call = fetch.mock.calls.at(0);
  if (!call) throw new Error('fetch was not called');
  return call[1].headers as Headers;
}

beforeEach(() => vi.mocked(accessToken).mockResolvedValue('token-value'));
afterEach(() => vi.unstubAllGlobals());

describe('execute api request', () => {
  it('does not send a request when token refresh fails', async () => {
    const fetch = respondWith('[]');
    vi.mocked(accessToken).mockRejectedValueOnce(
      new Error('Refresh unavailable'),
    );

    await expect(executeApiRequest({ ...BASE, accountSlot: 1 }))
      .rejects.toThrow('Refresh unavailable');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('sends the public client id and api version', async () => {
    const fetch = respondWith('[]');
    await executeApiRequest(BASE);

    expect(sentHeaders(fetch).get('trakt-api-version')).toBe('2');
    expect(sentHeaders(fetch).get('trakt-api-key')).toBeTruthy();
  });

  it('attaches the access token of the selected account', async () => {
    const fetch = respondWith('[]');
    await executeApiRequest({ ...BASE, accountSlot: 2 });

    expect(accessToken).toHaveBeenCalledWith(2);
    expect(sentHeaders(fetch).get('authorization')).toBe('Bearer token-value');
  });

  it('sends no token when no account is selected', async () => {
    const fetch = respondWith('[]');
    await executeApiRequest(BASE);

    expect(sentHeaders(fetch).get('authorization')).toBeNull();
  });

  it('never attaches an account token to an oauth endpoint', async () => {
    const fetch = respondWith('{}');
    await executeApiRequest({
      ...BASE,
      method: 'POST',
      url: 'https://auth.trakt.tv/oauth/token',
      accountSlot: 2,
      body: '{}',
    });

    expect(sentHeaders(fetch).get('authorization')).toBeNull();
  });

  it('fails when the selected account has no token', async () => {
    respondWith('[]');
    vi.mocked(accessToken).mockResolvedValue(null);

    await expect(executeApiRequest({ ...BASE, accountSlot: 1 }))
      .rejects.toThrow('The selected account is unavailable.');
  });

  it.each([
    'http://api.trakt.tv/movies/trending',
    'https://example.com/movies/trending',
    'https://api.trakt.tv:8443/movies/trending',
    'not a url',
  ])('refuses to request %s', async (url) => {
    respondWith('[]');
    await expect(executeApiRequest({ ...BASE, url })).rejects.toThrow(
      'Only approved Trakt API hosts can be requested.',
    );
  });

  it('refuses credentials embedded in the url', async () => {
    respondWith('[]');
    await expect(
      executeApiRequest({
        ...BASE,
        url: 'https://user:pass@api.trakt.tv/movies/trending',
      }),
    ).rejects.toThrow('Credentials are not allowed in request URLs.');
  });

  it('ignores a caller attempt to override a managed header', async () => {
    const fetch = respondWith('[]');
    await executeApiRequest({
      ...BASE,
      headers: [
        {
          id: 'a',
          name: 'authorization',
          value: 'Bearer forged',
          enabled: true,
        },
        { id: 'b', name: 'x-debug', value: 'on', enabled: true },
      ],
    });

    expect(sentHeaders(fetch).get('authorization')).toBeNull();
    expect(sentHeaders(fetch).get('x-debug')).toBe('on');
  });

  it('skips headers the caller disabled', async () => {
    const fetch = respondWith('[]');
    await executeApiRequest({
      ...BASE,
      headers: [{ id: 'a', name: 'x-debug', value: 'on', enabled: false }],
    });

    expect(sentHeaders(fetch).get('x-debug')).toBeNull();
  });

  it('pretty-prints a json body and reports its size', async () => {
    respondWith('{"a":1}');
    const result = await executeApiRequest(BASE);

    expect(result.isJson).toBe(true);
    expect(result.body).toBe('{\n  "a": 1\n}');
    expect(result.size).toBe(7);
  });

  it('passes a non-json body through untouched', async () => {
    respondWith('plain text');
    const result = await executeApiRequest(BASE);

    expect(result.isJson).toBe(false);
    expect(result.body).toBe('plain text');
  });

  it('reports the status of a failed request', async () => {
    respondWith('{}', { status: 404, statusText: 'Not Found' });
    const result = await executeApiRequest(BASE);

    expect(result.status).toBe(404);
    expect(result.statusText).toBe('Not Found');
  });

  it('refuses a response over the developer limit', async () => {
    respondWith('x'.repeat(2_000_001));
    await expect(executeApiRequest(BASE)).rejects.toThrow(
      'The response exceeded the 2 MB developer limit.',
    );
  });

  it('reports a network failure without leaking the cause', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('token-value leaked')),
    );

    await expect(executeApiRequest(BASE)).rejects.toThrow(
      'The Trakt API request could not be completed.',
    );
  });

  it('redacts the account token from the response body', async () => {
    respondWith(JSON.stringify({ echo: 'token-value' }));
    const result = await executeApiRequest({ ...BASE, accountSlot: 0 });

    expect(result.body).not.toContain('token-value');
    expect(result.body).toContain('[REDACTED]');
  });
});
