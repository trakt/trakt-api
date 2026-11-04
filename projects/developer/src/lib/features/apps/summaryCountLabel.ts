import { PROFILE_SUMMARY_LIMIT } from './PROFILE_SUMMARY_LIMIT.ts';
import { PROFILE_SUMMARY_MINIMUM } from './PROFILE_SUMMARY_MINIMUM.ts';

export function summaryCountLabel(summary: string): string {
  const length = summary.trim().length;
  const missing = PROFILE_SUMMARY_MINIMUM - length;
  if (missing === 1) return '1 more character needed.';
  if (missing > 1) return `${missing} more characters needed.`;

  return `${length}/${PROFILE_SUMMARY_LIMIT}`;
}
