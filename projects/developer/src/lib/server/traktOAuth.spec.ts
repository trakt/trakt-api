import { afterEach, describe, expect, it, vi } from 'vitest';
import { refreshOAuthSession, revokeOAuthSession } from './traktOAuth.ts';

const session = {
  accessToken: 'old-access',
  refreshToken: 'old-refresh',
  username: 'user',
  expiresAt: 1,
  createdAt: 0,
  tokenType: 'bearer',
  scope: 'public',
};
const credentials = { session, clientId: 'client', clientSecret: 'secret' };
afterEach(() => vi.unstubAllGlobals());

describe('OAuth requests', () => {
  it('refreshes against the auth host and returns the rotated tokens', async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(
        Response.json({
          access_token: 'new-access',
          refresh_token: 'new-refresh',
          created_at: 100,
          expires_in: 200,
        }),
      )
      .mockResolvedValueOnce(Response.json({ user: { username: 'user' } }));
    vi.stubGlobal('fetch', fetch);
    const refreshed = await refreshOAuthSession({
      ...credentials,
      redirectUri: 'http://localhost:5174/auth/callback',
    });

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'https://auth.trakt.tv/oauth/token',
      expect.objectContaining({ method: 'POST', redirect: 'error' }),
    );
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({
      refresh_token: 'old-refresh',
      grant_type: 'refresh_token',
    });
    expect(refreshed).toMatchObject({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      expiresAt: 300,
    });
  });

  it('revokes on the auth host', async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(null, { status: 200 }),
    );
    vi.stubGlobal('fetch', fetch);
    await revokeOAuthSession(credentials);

    expect(fetch).toHaveBeenCalledWith(
      'https://auth.trakt.tv/oauth/revoke',
      expect.objectContaining({ method: 'POST', redirect: 'error' }),
    );
    expect(JSON.parse(fetch.mock.calls[0][1].body).token).toBe('old-access');
  });

  it('rejects unsuccessful revocation', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    await expect(revokeOAuthSession(credentials)).rejects.toThrow(
      'Trakt rejected token revocation (503)',
    );
  });
});
