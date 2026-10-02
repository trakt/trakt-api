import type { DeveloperProfile } from './DeveloperProfile.ts';
import type { GithubConnectIntent } from './GithubConnectIntent.ts';

export type DeveloperRailProps = {
  profile: DeveloperProfile | null;
  busy: boolean;
  error?: string;
  canConnect?: boolean;
  onConnect: (intent: GithubConnectIntent) => void;
  onUnlink: () => void;
};
