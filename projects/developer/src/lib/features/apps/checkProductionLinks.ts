import { accountRequest } from '$lib/api/accountRequest.ts';
import type { ApplicationProfileInput } from './ApplicationProfileInput.ts';
import type { LinkReport } from './LinkReport.ts';
import { linkReportSchema } from './linkReportSchema.ts';

const LINK_CHECK_TIMEOUT_MS = 20_000;

/**
 * Asks Trakt to open the profile's links. Resolves to null when the check
 * itself is unavailable or too slow, so an outage never blocks a request.
 */
export async function checkProductionLinks({
  slot,
  appId,
  profile,
  request = accountRequest,
}: {
  slot: number;
  appId: number;
  profile: ApplicationProfileInput;
  request?: typeof accountRequest;
}): Promise<LinkReport | null> {
  try {
    const response = await request({
      slot,
      path: `/v3/users/me/applications/${appId}/production-review/link-check`,
      init: {
        method: 'POST',
        body: JSON.stringify({ profile }),
        signal: AbortSignal.timeout(LINK_CHECK_TIMEOUT_MS),
      },
    });
    const parsed = linkReportSchema.safeParse(await response.json());

    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
