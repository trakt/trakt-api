import type { DeveloperTier } from '$lib/features/premium/DeveloperTier.ts';
import type { Application } from './Application.ts';

export type ProductionPanelProps = {
  slot: number;
  app: Application;
  redirectsNeeded: boolean;
  tier: DeveloperTier;
  readOnly: boolean;
  onChanged: () => Promise<void>;
};
