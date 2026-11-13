import { accountRequest } from '$lib/api/accountRequest.ts';
import type { ApplicationProfileInput } from './ApplicationProfileInput.ts';
import type { LinkReport } from './LinkReport.ts';
import { linkReportSchema } from './linkReportSchema.ts';

/**
 * Asks Trakt to open the profile's links. Resolves to null when the check
 * itself is unavailable, so an outage never blocks a request.
 */
export async function checkProductionLinks({
  slot,
  appId,
  profile,
}: {
  slot: number;
  appId: number;
  profile: ApplicationProfileInput;
}): Promise<LinkReport | null> {
  try {
    const response = await accountRequest({
      slot,
      path: `/v3/users/me/applications/${appId}/production-review/link-check`,
      init: { method: 'POST', body: JSON.stringify({ profile }) },
    });
    const parsed = linkReportSchema.safeParse(await response.json());

    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
