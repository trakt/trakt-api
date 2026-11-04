import type { ApplicationProfile } from './ApplicationProfile.ts';

const SIGN_IN_LABELS = {
  none: 'Public data only',
  pkce: 'Signs users in (PKCE)',
  device_code: 'Signs users in (device code)',
} as const;

export function profileUsageLabel(
  profile: Pick<ApplicationProfile, 'sign_in' | 'writes_user_data'>,
): string {
  const signIn = SIGN_IN_LABELS[profile.sign_in];
  if (profile.sign_in === 'none') return signIn;

  return `${signIn} · ${profile.writes_user_data ? 'reads and writes' : 'read only'}`;
}
