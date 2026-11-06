import type { ApplicationProfileInput } from './ApplicationProfileInput.ts';
import { asksProductionRedirects } from './asksProductionRedirects.ts';
import { productionReviewIssues } from './productionReviewIssues.ts';
import type { ProductionReviewAnswers } from './ProductionReviewAnswers.ts';
import type { ProductionReviewInput } from './ProductionReviewInput.ts';
import { requestsClientSecret } from './requestsClientSecret.ts';
import { splitLines } from './splitLines.ts';

export function parseProductionReview({
  profile,
  ...answers
}: ProductionReviewAnswers & {
  profile: ApplicationProfileInput;
}): ProductionReviewInput {
  const signIn = profile.sign_in;
  const issue = productionReviewIssues({ ...answers, signIn }).at(0);
  if (issue) throw new Error(issue.message);

  const asksRedirects = asksProductionRedirects({ ...answers, signIn });
  const requestsSecret = requestsClientSecret({ ...answers, signIn });
  const coversSecret = requestsSecret || answers.hasClientSecret;

  return {
    profile,
    redirect_uri: asksRedirects ? splitLines(answers.redirects) : [],
    client_secret: requestsSecret
      ? { reason: answers.secretReason.trim() }
      : null,
    confirm_api_use_policy: true,
    ...(coversSecret && { confirm_secret_not_shipped: true as const }),
  };
}
