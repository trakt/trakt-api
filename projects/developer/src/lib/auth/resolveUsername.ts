import { z } from 'zod';
import { traktHeaders } from '$lib/api/traktHeaders.ts';
import { fallbackUsername } from './fallbackUsername.ts';

const settingsPayloadSchema = z.object({
  user: z.object({ username: z.string().optional() }).optional(),
});

export async function resolveUsername({
  accessToken,
  slot,
}: {
  accessToken: string;
  slot: number;
}): Promise<string> {
  const response = await fetch('https://api.trakt.tv/users/settings', {
    headers: traktHeaders({ accessToken }),
  }).catch(() => null);

  if (!response?.ok) return fallbackUsername(slot);

  const parsed = settingsPayloadSchema.safeParse(
    await response.json().catch(() => null),
  );
  const username = parsed.success ? parsed.data.user?.username : undefined;

  return username ? username : fallbackUsername(slot);
}
