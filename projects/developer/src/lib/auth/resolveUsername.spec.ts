import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveUsername } from './resolveUsername.ts';

afterEach(() => vi.unstubAllGlobals());

function respondWith(body: unknown, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), { status }),
    ),
  );
}

describe('resolve username', () => {
  it('uses the username from account settings', async () => {
    respondWith({ user: { username: 'sean' } });
    await expect(resolveUsername({ accessToken: 't', slot: 0 }))
      .resolves.toBe('sean');
  });

  it('sends the token and the public client id', async () => {
    respondWith({ user: { username: 'sean' } });
    await resolveUsername({ accessToken: 'token-value', slot: 0 });

    const call = vi.mocked(globalThis.fetch).mock.calls.at(0);
    if (!call) throw new Error('fetch was not called');
    const [url, init] = call;
    const headers = init?.headers as Headers;
    expect(url).toBe('https://api.trakt.tv/users/settings');
    expect(headers.get('authorization')).toBe('Bearer token-value');
    expect(headers.get('trakt-api-version')).toBe('2');
    expect(headers.get('trakt-api-key')).toBeTruthy();
  });

  it.each([
    ['the request fails', () => respondWith({}, 500)],
    ['the payload has no username', () => respondWith({ user: {} })],
    ['the username is empty', () => respondWith({ user: { username: '' } })],
    ['the body is not json', () =>
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(new Response('not json')),
      )],
    [
      'the network is unavailable',
      () =>
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline'))),
    ],
  ])('falls back to the slot name when %s', async (_, arrange) => {
    arrange();
    await expect(resolveUsername({ accessToken: 't', slot: 2 }))
      .resolves.toBe('Account 3');
  });
});
