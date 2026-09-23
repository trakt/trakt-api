import { accountRequest } from '$lib/api/accountRequest.ts';
import type { Application } from './Application.ts';
import { applicationSchema } from './applicationSchema.ts';

export async function listApplications(slot: number): Promise<Application[]> {
  const response = await accountRequest({
    slot,
    path: '/v3/users/me/applications',
  });
  const parsed = applicationSchema.array().safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('The app list could not be read. Please try again.');
  }
  return parsed.data;
}
