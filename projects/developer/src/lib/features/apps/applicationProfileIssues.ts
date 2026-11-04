import type { ApplicationProfileDraft } from './ApplicationProfileDraft.ts';
import { isWebUrl } from './isWebUrl.ts';
import { PROFILE_SUMMARY_LIMIT } from './PROFILE_SUMMARY_LIMIT.ts';
import { PROFILE_SUMMARY_MINIMUM } from './PROFILE_SUMMARY_MINIMUM.ts';
import type { ProductionFormField } from './ProductionFormField.ts';
import type { ProductionFormIssue } from './ProductionFormIssue.ts';
import { splitLinks } from './splitLinks.ts';

const LINK_LIMIT = 10;
const LINK_MAX_LENGTH = 2048;
const PRIVACY_URL_MAX_LENGTH = 500;
const EXPECTED_MAU_MAX = 4_294_967_295;
const OTHER_SERVICES_LIMIT = 255;

function summaryIssue(text: string): string | null {
  const length = text.trim().length;
  if (length < PROFILE_SUMMARY_MINIMUM) {
    return `Describe what your app does in at least ${PROFILE_SUMMARY_MINIMUM} characters.`;
  }
  if (length > PROFILE_SUMMARY_LIMIT) {
    return `Keep the description within ${PROFILE_SUMMARY_LIMIT} characters.`;
  }

  return null;
}

function linksIssue(text: string, label: string): string | null {
  const links = splitLinks(text);
  if (links.length === 0) return `Add at least one ${label}.`;
  if (links.length > LINK_LIMIT) return `Add up to ${LINK_LIMIT} ${label}s.`;

  if (links.some((link) => link.length > LINK_MAX_LENGTH)) {
    return `Keep each ${label} within 2,048 characters.`;
  }

  const invalid = links.find((link) => !isWebUrl(link) || /\s/.test(link));
  if (invalid) return `${invalid} isn't a valid http:// or https:// link.`;

  return null;
}

function privacyIssue(text: string): string | null {
  const url = text.trim();
  if (url.length > PRIVACY_URL_MAX_LENGTH) {
    return `Keep the privacy policy link within ${PRIVACY_URL_MAX_LENGTH} characters.`;
  }
  if (isWebUrl(url) && !/\s/.test(url)) return null;

  return 'Enter a valid link to your privacy policy.';
}

function mauIssue(text: string): string | null {
  const mau = text.trim();
  if (/^\d+$/.test(mau)) {
    return Number(mau) <= EXPECTED_MAU_MAX
      ? null
      : 'Enter no more than 4,294,967,295 expected monthly active users.';
  }

  return 'Enter your expected monthly active users as a number.';
}

function otherIssue(enabled: boolean, text: string, label: string) {
  if (!enabled) return null;

  const value = text.trim();
  if (!value) return `Name the other ${label} your app uses.`;
  if (value.length > OTHER_SERVICES_LIMIT) {
    return `Keep the other ${label} within ${OTHER_SERVICES_LIMIT} characters.`;
  }

  return null;
}

/** Every problem in a profile draft, at most one per field, in form order. */
export function applicationProfileIssues(
  draft: ApplicationProfileDraft,
): ReadonlyArray<ProductionFormIssue> {
  const checks: ReadonlyArray<[ProductionFormField, string | null]> = [
    ['summary', summaryIssue(draft.summary)],
    ['productLinks', linksIssue(draft.productLinks, 'link to your app')],
    ['privacyUrl', privacyIssue(draft.privacyUrl)],
    ['noticeLinks', linksIssue(draft.noticeLinks, 'notice link')],
    ['expectedMau', mauIssue(draft.expectedMau)],
    [
      'otherDataSources',
      otherIssue(draft.usesOtherData, draft.otherDataSources, 'data sources'),
    ],
    [
      'otherSyncServices',
      otherIssue(
        draft.syncsElsewhere,
        draft.otherSyncServices,
        'sync services',
      ),
    ],
  ];

  return checks.flatMap(([field, message]) =>
    message ? [{ field, message }] : [],
  );
}
