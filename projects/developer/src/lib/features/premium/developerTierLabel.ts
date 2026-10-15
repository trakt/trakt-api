import type { DeveloperTier } from './DeveloperTier.ts';

const LABELS: Readonly<Record<DeveloperTier, string>> = {
  standard: 'Standard',
  premium: 'Premium',
};

export function developerTierLabel(tier: DeveloperTier): string {
  return LABELS[tier];
}
