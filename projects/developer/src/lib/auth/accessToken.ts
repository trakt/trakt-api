import { userManager } from './userManager.ts';

export async function accessToken(slot: number): Promise<string | null> {
  const user = await userManager(slot).getUser().catch(() => null);
  return user?.access_token ?? null;
}
