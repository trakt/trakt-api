import type { DeveloperTier } from '$lib/features/premium/DeveloperTier.ts';
import type { DeveloperProfile } from './DeveloperProfile.ts';
import type { GithubConnectIntent } from './GithubConnectIntent.ts';

export type DeveloperRailProps = {
  profile: DeveloperProfile | null;
  tier: DeveloperTier | null;
  busy: boolean;
  error?: string;
  canConnect?: boolean;
  onConnect: (intent: GithubConnectIntent) => void;
  onUnlink: () => void;
};
