import type { ApplicationProfileDraft } from './ApplicationProfileDraft.ts';
import type { ApplicationProfileInput } from './ApplicationProfileInput.ts';
import { applicationProfileIssues } from './applicationProfileIssues.ts';
import { splitLinks } from './splitLinks.ts';

function otherValue(enabled: boolean, text: string): string | null {
  return enabled ? text.trim() : null;
}

export function parseApplicationProfile(
  draft: ApplicationProfileDraft,
): ApplicationProfileInput {
  const issue = applicationProfileIssues(draft).at(0);
  if (issue) throw new Error(issue.message);

  return {
    summary: draft.summary.trim(),
    open_source: draft.openSource,
    product_links: splitLinks(draft.productLinks),
    privacy_url: draft.privacyUrl.trim(),
    notice_links: splitLinks(draft.noticeLinks),
    expected_mau: Number(draft.expectedMau.trim()),
    sign_in: draft.signIn,
    writes_user_data: draft.signIn === 'none' ? false : draft.writesUserData,
    other_data_sources: otherValue(draft.usesOtherData, draft.otherDataSources),
    other_sync_services: otherValue(
      draft.syncsElsewhere,
      draft.otherSyncServices,
    ),
  };
}
