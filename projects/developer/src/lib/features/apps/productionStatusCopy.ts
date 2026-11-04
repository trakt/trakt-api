import { formatDate } from './formatDate.ts';
import type { ProductionReview } from './ProductionReview.ts';

export type ProductionStatusCopy = {
  badge: string;
  title: string;
  detail: string;
  tone: 'info' | 'warning' | 'success' | 'danger';
};

const NOT_AN_ENDORSEMENT =
  "This doesn't mean Trakt endorses or certifies your app.";

export function productionStatusCopy(
  review: ProductionReview | null | undefined,
  fullProduction = false,
): ProductionStatusCopy | null {
  if (!review) return null;

  const decided = formatDate(review.reviewed_at ?? review.submitted_at);
  const firstTime = review.kind === 'production';
  switch (review.status) {
    case 'pending':
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
        detail: 'Update your request, then resubmit.',
        tone: 'warning',
      };
    case 'granted':
    case 'granted_instantly': {
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
  }
}
