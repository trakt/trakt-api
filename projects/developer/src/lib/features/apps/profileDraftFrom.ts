import type { ApplicationProfileInput } from './ApplicationProfileInput.ts';
import type { ApplicationProfileDraft } from './ApplicationProfileDraft.ts';

export function profileDraftFrom(
  profile: ApplicationProfileInput | null,
): ApplicationProfileDraft {
  return {
    summary: profile?.summary ?? '',
    openSource: profile?.open_source ?? false,
    productLinks: profile?.product_links.join(', ') ?? '',
    privacyUrl: profile?.privacy_url ?? '',
    noticeLinks: profile?.notice_links.join(', ') ?? '',
    expectedMau: profile ? String(profile.expected_mau) : '',
    signIn: profile?.sign_in ?? 'pkce',
    writesUserData: profile?.writes_user_data ?? false,
    usesOtherData: !!profile?.other_data_sources,
    otherDataSources: profile?.other_data_sources ?? '',
    syncsElsewhere: !!profile?.other_sync_services,
    otherSyncServices: profile?.other_sync_services ?? '',
  };
}
