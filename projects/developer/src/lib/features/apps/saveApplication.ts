import { accountRequest } from '$lib/api/accountRequest.ts';
import type { Application } from './Application.ts';
import { applicationSchema } from './applicationSchema.ts';
import type { ApplicationInput } from './ApplicationInput.ts';

export async function saveApplication(
  slot: number,
  input: ApplicationInput,
  id?: number,
): Promise<Application | null> {
  const response = await accountRequest({
    slot,
    path: `/v3/users/me/applications${id === undefined ? '' : `/${id}`}`,
    init: {
      method: id === undefined ? 'POST' : 'PATCH',
      body: JSON.stringify(input),
    },
  });
  const parsed = applicationSchema.safeParse(
    await response.json().catch(() => null),
  );
  return parsed.success ? parsed.data : null;
}
