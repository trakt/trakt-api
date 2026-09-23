import { accessToken } from '$lib/auth/accessToken.ts';
import { developerErrorMessage } from './developerErrorMessage.ts';
import { traktHeaders } from './traktHeaders.ts';

async function errorCode(response: Response): Promise<unknown> {
  const body = await response.json().catch(() => null) as
    | { error?: unknown }
    | null;
  return body?.error;
}

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
    const localized = developerErrorMessage(await errorCode(response));
    const messages: Record<number, string> = {
      400:
        'The request could not be accepted. Check your details and try again.',
      401: 'Your session has expired. Refresh your account or sign in again.',
      403:
        'This account cannot perform this action. Check your app limit and your GitHub account connection.',
      404: 'This app is no longer available. Reload your apps.',
      422: 'Check your app details. The server could not accept these values.',
      429: 'Too many requests. Please wait before trying again.',
    };
    throw new Error(
      localized ??
        messages[response.status] ??
        `The request failed (${response.status}). Please try again.`,
    );
  }
  return response;
}
