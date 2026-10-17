import { accountRequest } from '$lib/api/accountRequest.ts';
import { managersSchema } from './managersSchema.ts';

export async function listManagers(slot: number, appId: number) {
  const response = await accountRequest({
    slot,
    path: `/v3/users/me/applications/${appId}/managers`,
  });
  const parsed = managersSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('The managers could not be read. Please try again.');
  }
  return parsed.data.managers;
}
