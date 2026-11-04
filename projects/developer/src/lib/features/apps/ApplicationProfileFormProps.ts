import type { DeveloperTier } from '$lib/features/premium/DeveloperTier.ts';
import type { ApplicationProfileInput } from './ApplicationProfileInput.ts';
import type { ProductionReviewInput } from './ProductionReviewInput.ts';

export type ApplicationProfileFormProps = {
  appName: string;
  profile: ApplicationProfileInput | null;
  createsProductionApp: boolean;
  redirectsNeeded: boolean;
  allowsPublicDataOnly: boolean;
  initialRedirects?: string;
  initialSecretReason?: string | null;
  asksForSecret?: boolean;
  tier: DeveloperTier;
  hasClientSecret: boolean;
  busy: boolean;
  onSubmit: (review: ProductionReviewInput) => void;
  onCancel: () => void;
};
