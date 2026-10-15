import type { DeveloperTier } from './DeveloperTier.ts';

export type DeveloperPlanCardProps = {
  tier: DeveloperTier;
  count: number;
  limit: number;
};
