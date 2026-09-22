import { accessToken } from '$lib/auth/accessToken.ts';
import { traktHeaders } from './traktHeaders.ts';

// Account requests bypass playground history, response previews, and storage.
export async function accountRequest(
  slot: number,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await accessToken(slot);
  if (!token) throw new Error('Sign in to manage your apps.');
  const headers = traktHeaders({ accessToken: token });
  if (init.body) headers.set('content-type', 'application/json');
  const response = await fetch(`https://api.trakt.tv${path}`, {
    ...init,
    headers,
    cache: 'no-store',
    redirect: 'error',
  });
  if (!response.ok) {
    const messages: Record<number, string> = {
      400:
        'Your GitHub connection could not be verified. Reconnect and try again.',
      401: 'Your session has expired. Refresh your account or sign in again.',
      403:
        'This account cannot perform this action. Check your app limit and your GitHub account connection.',
      404: 'This app is no longer available. Reload your apps.',
      422: 'Check your app details. The server could not accept these values.',
      429: 'Too many requests. Please wait before trying again.',
    };
    throw new Error(
      messages[response.status] ??
        `The request failed (${response.status}). Please try again.`,
    );
  }
  return response;
}
