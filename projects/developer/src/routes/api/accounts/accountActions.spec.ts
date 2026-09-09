import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('$env/dynamic/private', () => ({
  env: {
    TRAKT_CLIENT_ID: 'client',
    TRAKT_CLIENT_SECRET: 'secret',
    DEVELOPER_SESSION_SECRET: 'session-secret',
  },
}));
vi.mock(
  '$lib/server/readAccountSession.ts',
  () => ({ readAccountSession: vi.fn() }),
);
vi.mock(
  '$lib/server/sessionCipher.ts',
  () => ({ encryptSession: vi.fn().mockResolvedValue('encrypted') }),
);
vi.mock(
  '$lib/server/traktOAuth.ts',
  () => ({ refreshOAuthSession: vi.fn(), revokeOAuthSession: vi.fn() }),
);
import { readAccountSession } from '$lib/server/readAccountSession.ts';
import {
  refreshOAuthSession,
  revokeOAuthSession,
} from '$lib/server/traktOAuth.ts';
import { POST } from './[slot]/refresh/+server.ts';
import { DELETE } from './[slot]/+server.ts';

function event(method: string, origin = 'http://127.0.0.1:5174') {
  return {
    params: { slot: '2' },
    url: new URL(`${origin}/api/accounts/2`),
    request: new Request(`${origin}/api/accounts/2`, {
      method,
      headers: { origin },
    }),
    cookies: { set: vi.fn(), delete: vi.fn() },
  } as unknown as RequestEvent;
}

describe('account session lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(revokeOAuthSession).mockResolvedValue(undefined);
    vi.mocked(readAccountSession).mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
      username: 'user',
      expiresAt: 1,
      createdAt: 0,
      tokenType: 'bearer',
      scope: 'public',
    });
  });

  it('replaces the selected session cookie after refresh', async () => {
    const e = event('POST');
    const session = await readAccountSession({ cookies: e.cookies, slot: 2 });
    vi.mocked(refreshOAuthSession).mockResolvedValue({
      ...session!,
      accessToken: 'renewed',
      expiresAt: 9999999999,
    });

    expect((await POST(e)).status).toBe(200);
    expect(e.cookies.set).toHaveBeenCalledWith(
      'trakt-developer-account-2',
      expect.anything(),
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    );
  });

  it('reports failed refresh and preserves the cookie', async () => {
    const e = event('POST');
    vi.mocked(refreshOAuthSession).mockRejectedValue(
      new Error('private upstream detail'),
    );
    await expect(POST(e)).rejects.toMatchObject({ status: 502 });
    expect(e.cookies.set).not.toHaveBeenCalled();
  });

  it('revokes the token and removes the selected cookie', async () => {
    const e = event('DELETE');
    expect((await DELETE(e)).status).toBe(200);
    expect(revokeOAuthSession).toHaveBeenCalledWith(
      expect.objectContaining({
        session: expect.objectContaining({ accessToken: 'access' }),
      }),
    );
    expect(e.cookies.delete).toHaveBeenCalledWith('trakt-developer-account-2', {
      path: '/',
      secure: false,
    });
  });

  it('removes local authentication even when revocation fails', async () => {
    const e = event('DELETE');
    vi.mocked(revokeOAuthSession).mockRejectedValue(new Error('rejected'));
    const response = await DELETE(e);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, revoked: false });
    expect(e.cookies.delete).toHaveBeenCalledWith('trakt-developer-account-2', {
      path: '/',
      secure: false,
    });
    expect(e.cookies.delete).toHaveBeenCalledWith(
      'trakt-developer-oauth-state',
      { path: '/auth', secure: false },
    );
  });
});
