import { formatDate } from './formatDate.ts';
import type { ProductionReview } from './ProductionReview.ts';

export type ProductionStatusCopy = {
  badge: string;
  title: string;
  detail: string;
  tone: 'info' | 'warning' | 'success' | 'danger';
};

const LIVE_CHANGES_DEADLINE_DAYS = 14;

const NOT_AN_ENDORSEMENT =
  "This doesn't mean Trakt endorses or certifies your app.";

export function productionStatusCopy(
  review: ProductionReview | null | undefined,
  fullProduction = false,
): ProductionStatusCopy | null {
  if (!review) return null;

  const decided = formatDate(review.reviewed_at ?? review.submitted_at);
  const firstTime = review.kind === 'production';
  const afterGoLive = review.kind === 'post_review';
  switch (review.status) {
    case 'pending':
      if (review.kind === 'client_secret')
        return {
          badge: 'Client Secret requested',
          title: `Client Secret requested · ${formatDate(review.submitted_at)}`,
          detail:
            "Your Production app is ready. Your Client Secret request is waiting for a review. We'll email you when it's reviewed.",
          tone: 'info',
        };
      return {
        badge: 'Review requested',
        title: `Review requested · ${formatDate(review.submitted_at)}`,
        detail:
          "We'll email you when it's reviewed. Nothing changes until then.",
        tone: 'info',
      };
    case 'changes_requested':
      return {
        badge: 'Changes requested',
        title: `Changes requested · ${decided}`,
        detail: afterGoLive
          ? `Your Production app stays live for now. Make the changes and resubmit within ${LIVE_CHANGES_DEADLINE_DAYS} days of this request, or its access is suspended.`
          : 'Update your request, then resubmit.',
        tone: 'warning',
      };
    case 'granted':
    case 'granted_instantly': {
      if (afterGoLive)
        return {
          badge: 'Review complete',
          title: `Review complete · ${decided}`,
          detail: `We looked at your live app and nothing needs to change. ${NOT_AN_ENDORSEMENT}`,
          tone: 'success',
        };

      const readOnly = !fullProduction && review.granted_access === 'read_only';
      const label = readOnly
        ? 'Read-only Production access granted'
        : firstTime
          ? 'Production access granted'
          : 'Changes granted';
      const lead = readOnly
        ? 'Your app can read public data. Nobody can sign in to it; to change that, request a review.'
        : firstTime
          ? 'Your Production app is ready.'
          : '';
      return {
        badge: label,
        title: `${label} · ${decided}`,
        detail: `${lead} ${NOT_AN_ENDORSEMENT}`.trim(),
        tone: 'success',
      };
    }
    case 'declined':
      return {
        badge: 'Review declined',
        title: `Review declined · ${decided}`,
        detail: 'Nothing changed. You can request another review.',
        tone: 'danger',
      };
    case 'suspended':
      return {
        badge: 'Production access suspended',
        title: `Production access suspended · ${decided}`,
        detail:
          'Your Production app can no longer call the API. Your Development app still works. Fix the points above and resubmit; a reviewer will look at it.',
        tone: 'danger',
      };
  }
}
