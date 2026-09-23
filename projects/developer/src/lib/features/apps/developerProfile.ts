import { z } from 'zod';
import { accountRequest } from '$lib/api/accountRequest.ts';

export const developerProfileSchema = z.object({
  github: z
    .object({
      id: z.number(),
      username: z.string(),
      linked_at: z.string().nullish(),
    })
    .nullable(),
  applications: z.object({
    count: z.number(),
    limit: z.number(),
  }),
});
export type DeveloperProfile = z.infer<typeof developerProfileSchema>;

const GITHUB_PATH = '/v3/users/me/developer/github';

export async function getDeveloperProfile(
  slot: number,
): Promise<DeveloperProfile> {
  const response = await accountRequest(slot, '/v3/users/me/developer');
  const parsed = developerProfileSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error(
      'Your developer account could not be read. Please try again.',
    );
  }
  return parsed.data;
}
export async function linkGithub(
  slot: number,
  code: string,
  allowSwitch: boolean,
): Promise<void> {
  await accountRequest(slot, GITHUB_PATH, {
    method: 'PUT',
    body: JSON.stringify({ code, switch: allowSwitch }),
  });
}
export async function unlinkGithub(slot: number): Promise<void> {
  await accountRequest(slot, GITHUB_PATH, { method: 'DELETE' });
}
