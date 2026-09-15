import { PUBLIC_TRAKT_CLIENT_ID } from '$env/static/public';

type TraktHeadersOptions = {
  accessToken?: string | null;
  base?: Headers;
};

export function traktHeaders(
  { accessToken, base }: TraktHeadersOptions = {},
): Headers {
  const headers = new Headers(base);

  headers.set('accept', headers.get('accept') ?? 'application/json');
  headers.set('trakt-api-key', PUBLIC_TRAKT_CLIENT_ID);
  headers.set('trakt-api-version', '2');
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);

  return headers;
}
