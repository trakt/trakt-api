import { afterEach, describe, expect, it, vi } from 'vitest';
import { accessToken } from '$lib/auth/accessToken.ts';
import { deleteApplication } from './deleteApplication.ts';
import { listApplications } from './listApplications.ts';
import { saveApplication } from './saveApplication.ts';
vi.mock('$lib/auth/accessToken.ts', () => ({ accessToken: vi.fn() }));
vi.mock(
  '$env/static/public',
  () => ({ PUBLIC_TRAKT_CLIENT_ID: 'test-client' }),
);

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const input = { name: 'Test', redirect_uri: ['test://callback'], origins: [] };

describe('app management transport', () => {
  it('waits for a refreshed token before sending a mutation', async () => {
    let finish: (token: string) => void = () => {};
    vi.mocked(accessToken).mockReturnValueOnce(
      new Promise<string>((resolve) => {
        finish = resolve;
      }),
    );
    const fetcher = vi.fn().mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    vi.stubGlobal('fetch', fetcher);

    const request = deleteApplication(2, 42);
    expect(fetcher).not.toHaveBeenCalled();
    finish('refreshed-token');
    await request;
    expect(fetcher.mock.calls.at(0)?.[1].headers.get('authorization'))
      .toBe('Bearer refreshed-token');
  });

  it('does not send a mutation when token refresh fails', async () => {
    vi.mocked(accessToken).mockRejectedValueOnce(
      new Error('Refresh unavailable'),
    );
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);

    await expect(deleteApplication(2, 42)).rejects.toThrow(
      'Refresh unavailable',
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('never sends an anonymous management request', async () => {
    vi.mocked(accessToken).mockResolvedValue(null);
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    await expect(listApplications(2)).rejects.toThrow('Sign in');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('uses the selected account and the exact V3 methods and payload', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    const fetcher = vi.fn().mockImplementation(() =>
      Promise.resolve(new Response(null, { status: 204 }))
    );
    vi.stubGlobal('fetch', fetcher);
    await saveApplication(3, input);
    await saveApplication(3, input, 42);
    await deleteApplication(3, 42);
    expect(accessToken).toHaveBeenCalledWith(3);
    expect(fetcher.mock.calls.map(([url, init]) => [url, init.method])).toEqual(
      [
        ['https://api.trakt.tv/v3/users/me/applications', 'POST'],
        ['https://api.trakt.tv/v3/users/me/applications/42', 'PATCH'],
        ['https://api.trakt.tv/v3/users/me/applications/42', 'DELETE'],
      ],
    );
    const call = fetcher.mock.calls.at(0);
    if (!call) throw new Error('fetch was not called');
    const init = call[1];
    expect(JSON.parse(init.body)).toEqual(input);
    expect(init.headers.get('authorization')).toBe('Bearer test-token');
    expect(init.cache).toBe('no-store');
    expect(init.redirect).toBe('error');
  });

  it('does not echo error bodies or credentials', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('sensitive-server-output', { status: 403 }),
      ),
    );
    await expect(saveApplication(0, input)).rejects.toThrow('app limit');
  });

  it('maps a known error code to the portal copy', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({ error: 'github_account_taken' }, { status: 403 }),
      ),
    );
    await expect(saveApplication(0, input)).rejects.toThrow(
      'already connected to another Trakt account',
    );
  });

  it('never shows server text, even inside a JSON error', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({ error: 'Application limit reached (5)' }, {
          status: 403,
        }),
      ),
    );
    await expect(saveApplication(0, input)).rejects.toThrow(
      'This account cannot perform this action',
    );
  });

  it('ignores an error that is not a string', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({ error: { secret: 'x' } }, { status: 400 }),
      ),
    );
    await expect(saveApplication(0, input)).rejects.toThrow(
      'Check your details',
    );
  });

  it('falls back to the status copy for an unknown code', async () => {
    vi.mocked(accessToken).mockResolvedValue('test-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({ error: 'something_new' }, { status: 429 }),
      ),
    );
    await expect(saveApplication(0, input)).rejects.toThrow(
      'Too many requests',
    );
  });
});
