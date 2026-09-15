import { PUBLIC_TRAKT_CLIENT_ID } from '$env/static/public';
import { fallbackUsername } from './accountSlots.ts';

type SettingsPayload = { user?: { username?: unknown } };

export async function resolveUsername({
  accessToken,
  slot,
}: {
  accessToken: string;
  slot: number;
}): Promise<string> {
  const response = await fetch('https://api.trakt.tv/users/settings', {
    headers: {
      authorization: `Bearer ${accessToken}`,
      'trakt-api-key': PUBLIC_TRAKT_CLIENT_ID,
      'trakt-api-version': '2',
    },
  }).catch(() => null);

  if (!response?.ok) return fallbackUsername(slot);

  const body = await response.json().catch(() => null) as
    | SettingsPayload
    | null;

  return typeof body?.user?.username === 'string' && body.user.username
    ? body.user.username
    : fallbackUsername(slot);
}
