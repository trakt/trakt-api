export type ProductionReviewAnswers = {
  redirectsNeeded: boolean;
  redirects: string;
  needsSecret: boolean;
  secretReason: string;
  confirmPolicy: boolean;
  confirmSecret: boolean;
  hasClientSecret: boolean;
};
