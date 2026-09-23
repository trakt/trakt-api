import type { DeveloperProfile } from './developerProfile.ts';
import type { GithubConnectIntent } from './githubConnect.ts';

export type DeveloperRailProps = {
  profile: DeveloperProfile | null;
  busy: boolean;
  error?: string;
  onConnect: (intent: GithubConnectIntent) => void;
  onUnlink: () => void;
};
