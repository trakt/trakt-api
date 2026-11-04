import { asksProductionRedirects } from './asksProductionRedirects.ts';
import type { ProductionFormField } from './ProductionFormField.ts';
import type { ProductionFormIssue } from './ProductionFormIssue.ts';
import type { ProductionReviewAnswers } from './ProductionReviewAnswers.ts';
import type { ProductionSignIn } from './ProductionSignIn.ts';
import { requestsClientSecret } from './requestsClientSecret.ts';
import { splitLines } from './splitLines.ts';
import { unsafeRedirectUris } from './unsafeRedirectUris.ts';

const SECRET_REASON_LIMIT = 500;

function redirectsIssue(asks: boolean, redirects: string): string | null {
  if (!asks) return null;
  const lines = splitLines(redirects);
  if (lines.length === 0) {
    return 'Add at least one production redirect URI.';
  }

  if (lines.some((uri) => /\s/.test(uri))) {
    return 'Production redirect URIs cannot contain whitespace.';
  }
  const blocked = unsafeRedirectUris(redirects);
  if (blocked.length > 0) {
    return `Production redirect URIs must use https:// on a domain you control. Change ${blocked.join(', ')}.`;
  }
  if (
    lines.some((uri) => {
      const url = new URL(uri);
      return url.search || url.hash;
    })
  ) {
    return 'Production redirect URIs cannot contain queries or fragments.';
  }
  if (lines.length > 25 || lines.join('\n').length > 2048) {
    return 'Enter 1-25 redirect URIs, within 2,048 characters in total.';
  }

  return null;
}

function secretReasonIssue(requests: boolean, text: string): string | null {
  if (!requests) return null;

  const reason = text.trim();
  if (!reason) return 'Tell us why your server needs a Client Secret.';
  if (reason.length > SECRET_REASON_LIMIT) {
    return `Keep the Client Secret reason within ${SECRET_REASON_LIMIT} characters.`;
  }

  return null;
}

/** Every problem in the review part of the form, at most one per field, in form order. */
export function productionReviewIssues(
  answers: ProductionReviewAnswers & { signIn: ProductionSignIn },
): ReadonlyArray<ProductionFormIssue> {
  const requests = requestsClientSecret(answers);
  const coversSecret = requests || answers.hasClientSecret;
  const checks: ReadonlyArray<[ProductionFormField, string | null]> = [
    [
      'redirects',
      redirectsIssue(asksProductionRedirects(answers), answers.redirects),
    ],
    ['secretReason', secretReasonIssue(requests, answers.secretReason)],
    [
      'confirmPolicy',
      answers.confirmPolicy
        ? null
        : 'Confirm that your app follows the API Use Policy.',
    ],
    [
      'confirmSecret',
      coversSecret && !answers.confirmSecret
        ? 'Confirm that your Client Secret never ships in your app or website.'
        : null,
    ],
  ];

  return checks.flatMap(([field, message]) =>
    message ? [{ field, message }] : [],
  );
}
