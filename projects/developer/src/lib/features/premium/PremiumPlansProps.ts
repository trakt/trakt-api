import type { DeveloperTier } from './DeveloperTier.ts';

export type PremiumPlansProps = {
  tier: DeveloperTier | null;
  amount: number;
  signedIn: boolean;
  ready: boolean;
  busy: boolean;
  onUpgrade: () => void;
};
