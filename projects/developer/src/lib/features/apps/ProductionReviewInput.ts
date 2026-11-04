import type { ApplicationProfileInput } from './ApplicationProfileInput.ts';

export type ProductionReviewInput = {
  profile: ApplicationProfileInput;
  redirect_uri: string[];
  client_secret: { reason: string } | null;
  confirm_api_use_policy: true;
  confirm_secret_not_shipped?: true;
};
