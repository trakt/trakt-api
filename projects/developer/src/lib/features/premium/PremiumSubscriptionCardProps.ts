import type { DeveloperSubscription } from './DeveloperSubscription.ts';

export type PremiumSubscriptionCardProps = {
  subscription: DeveloperSubscription;
  busy: boolean;
  onUpdatePayment: () => void;
  onCancel: () => void;
};
