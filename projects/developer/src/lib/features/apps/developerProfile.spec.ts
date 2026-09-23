import { afterEach, describe, expect, it, vi } from 'vitest';
import { accessToken } from '$lib/auth/accessToken.ts';
import {
  getDeveloperProfile,
  linkGithub,
  unlinkGithub,
} from './developerProfile.ts';
vi.mock('$lib/auth/accessToken.ts', () => ({ accessToken: vi.fn() }));
vi.mock(
  '$env/static/public',
  () => ({ PUBLIC_TRAKT_CLIENT_ID: 'test-client' }),
);
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('developer profile transport', () => {
  it('reads a linked profile', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    const profile = {
      github: {
        id: 6339681,
        username: 'vladjerca',
        linked_at: '2026-09-23T08:21:05.000Z',
      },
      applications: { count: 1, limit: 5 },
    };
    const fetcher = vi.fn().mockResolvedValue(Response.json(profile));
    vi.stubGlobal('fetch', fetcher);

    await expect(getDeveloperProfile(2)).resolves.toEqual(profile);
    expect(fetcher.mock.calls[0]![0]).toBe(
      'https://api.trakt.tv/v3/users/me/developer',
    );
    expect(accessToken).toHaveBeenCalledWith(2);
  });

  it('reads an unlinked profile', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({ github: null, applications: { count: 2, limit: 5 } }),
      ),
    );
    await expect(getDeveloperProfile(0)).resolves.toEqual({
      github: null,
      applications: { count: 2, limit: 5 },
    });
  });

  it('rejects a malformed profile', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ github: null })),
    );
    await expect(getDeveloperProfile(0)).rejects.toThrow(
      'could not be read',
    );
  });

  it('links with the code and the switch intent, and unlinks with DELETE', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    const fetcher = vi.fn().mockImplementation(() =>
      Promise.resolve(new Response(null, { status: 204 }))
    );
    vi.stubGlobal('fetch', fetcher);

    await linkGithub(1, 'abc', true);
    await unlinkGithub(1);

    expect(fetcher.mock.calls.map(([url, init]) => [url, init.method])).toEqual(
      [
        ['https://api.trakt.tv/v3/users/me/developer/github', 'PUT'],
        ['https://api.trakt.tv/v3/users/me/developer/github', 'DELETE'],
      ],
    );
    expect(JSON.parse(fetcher.mock.calls[0]![1].body)).toEqual({
      code: 'abc',
      switch: true,
    });
  });
});
