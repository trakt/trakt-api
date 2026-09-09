import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('$env/dynamic/private', () => ({
  env: {
    TRAKT_CLIENT_ID: 'test-app-key',
    TRAKT_CLIENT_SECRET: 'test-app-secret',
    DEVELOPER_SESSION_SECRET: 'test-encryption-secret',
  },
}));
vi.mock('$lib/server/readAccountSession.ts', () => ({
  readAccountSession: vi.fn(async () => ({
    accessToken: 'test-user-token',
    refreshToken: 'test-refresh-token',
  })),
}));
import { POST } from './+server.ts';
import { readAccountSession } from '$lib/server/readAccountSession.ts';

const upstream = vi.fn(async () =>
  new Response(
    JSON.stringify({
      title: 'TRON',
      access_token: 'new-token',
      echo: 'test-app-key test-user-token test-app-secret',
    }),
    {
      headers: {
        'set-cookie': 'private=value',
        'trakt-api-key': 'test-app-key',
      },
    },
  )
);

function event(
  target: string,
  accountSlot: number | null = 0,
  origin = 'http://localhost:5174',
) {
  return {
    url: new URL('http://localhost:5174/api/execute'),
    request: new Request('http://localhost:5174/api/execute', {
      method: 'POST',
      headers: { origin, 'content-type': 'application/json' },
      body: JSON.stringify({
        method: 'POST',
        url: target,
        accountSlot,
        body: '{}',
        headers: [
          { name: 'Authorization', value: 'Bearer attacker', enabled: true },
          { name: 'Cookie', value: 'private=value', enabled: true },
        ],
      }),
    }),
    cookies: {},
    fetch: upstream,
  } as unknown as RequestEvent;
}

describe('execution credential boundary', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should inject credentials only on the server and redact the returned response', async () => {
    const response = await POST(event('https://api.trakt.tv/sync/history'));
    const init = (upstream.mock.calls.at(0) as unknown as [URL, RequestInit])
      ?.at(1) as RequestInit;
    const headers = new Headers(init.headers);

    expect(headers.get('authorization')).toBe('Bearer test-user-token');
    expect(headers.get('cookie')).toBeNull();
    expect(init.redirect).toBe('manual');
    expect(init.credentials).toBe('omit');

    const body = await response.text();
    expect(body).not.toMatch(
      /new-token|test-app-key|test-user-token|test-app-secret|private=value/,
    );
    expect(body).toContain('TRON');
  });

  it.each([
    'https://auth.trakt.tv/oauth/token',
    'https://api.trakt.tv/oauth/revoke',
  ])(
    'should never attach account tokens to %s',
    async (target) => {
      await POST(event(target));
      expect(readAccountSession).not.toHaveBeenCalled();
      const init = (upstream.mock.calls.at(0) as unknown as [URL, RequestInit])
        ?.at(1) as RequestInit;
      expect(new Headers(init.headers).has('authorization')).toBe(false);
    },
  );

  it('should honor anonymous requests', async () => {
    await POST(event('https://api.trakt.tv/movies/trending', null));
    expect(readAccountSession).not.toHaveBeenCalled();
    const init = (upstream.mock.calls.at(0) as unknown as [URL, RequestInit])
      ?.at(1) as RequestInit;
    expect(new Headers(init.headers).has('authorization')).toBe(false);
  });

  it.each([
    'https://example.test',
    'https://api.trakt.tv:8443',
    'http://api.trakt.tv',
  ])(
    'should reject unapproved destinations: %s',
    async (target) => {
      await expect(POST(event(target))).rejects.toMatchObject({ status: 400 });
      expect(upstream).not.toHaveBeenCalled();
    },
  );

  it('should reject cross-origin requests before sending credentials', async () => {
    await expect(
      POST(
        event(
          'https://api.trakt.tv/movies/trending',
          0,
          'https://example.test',
        ),
      ),
    )
      .rejects.toMatchObject({ status: 403 });
    expect(upstream).not.toHaveBeenCalled();
  });
});
