import { z } from 'zod';
import { avatarUrl } from '$lib/auth/avatarUrl.ts';
import { accountRequest } from './accountRequest.ts';

const accountSettingsSchema = z.object({
  user: z.object({
    vip: z.boolean().nullish(),
    vip_ep: z.boolean().nullish(),
    images: z.object({
      avatar: z.object({
        full: z.string().nullish(),
      }).nullish(),
    }).nullish(),
  }).nullish(),
});

export async function fetchAccountProfile(
  slot: number,
): Promise<{ vip: boolean; avatar: string | null } | null> {
  try {
    const response = await accountRequest({ slot, path: '/users/settings' });
    const parsed = accountSettingsSchema.safeParse(await response.json());
    if (!parsed.success) return null;

    const user = parsed.data.user;
    return {
      vip: user?.vip === true || user?.vip_ep === true,
      avatar: avatarUrl(user?.images?.avatar?.full),
    };
  } catch {
    return null;
  }
}
