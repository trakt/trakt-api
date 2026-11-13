import type { ApplicationProfileDraft } from './ApplicationProfileDraft.ts';
import { DEVELOPMENT_SEAT_LIMIT } from './DEVELOPMENT_SEAT_LIMIT.ts';
import { isReviewableLink } from './isReviewableLink.ts';
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

const samePage = (link: string) =>
  link
    .replace(/\/$/, '')
    .replace(/^[a-z][a-z0-9+.-]*:\/\/[^/?#]*/i, (origin) =>
      origin.toLowerCase(),
    );

const unreviewableMessage = (link: string) =>
  `We can't review ${link}. Link a public page about your app, not a placeholder or a Trakt page.`;

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

  const blocked = links.find((link) => !isReviewableLink(link));
  if (blocked) return unreviewableMessage(blocked);

  return null;
}

function privacyIssue(draft: ApplicationProfileDraft): string | null {
  const url = draft.privacyUrl.trim();
  if (url.length > PRIVACY_URL_MAX_LENGTH) {
    return `Keep the privacy policy link within ${PRIVACY_URL_MAX_LENGTH} characters.`;
  }
  if (!isWebUrl(url) || /\s/.test(url)) {
    return 'Enter a valid link to your privacy policy.';
  }
  if (!isReviewableLink(url)) return unreviewableMessage(url);

  const { pathname, search, hash } = new URL(url);
  if (pathname === '/' && search === '' && hash === '') {
    return 'Link to the privacy policy page itself, not your home page.';
  }

  const reused = [
    ...splitLinks(draft.productLinks),
    ...splitLinks(draft.noticeLinks),
  ].some((link) => samePage(link) === samePage(url));
  if (reused) {
    return 'Your privacy policy needs its own link. This one is also listed as an app or notice link.';
  }

  return null;
}

function mauIssue(text: string): string | null {
  const mau = text.trim();
  if (!/^\d+$/.test(mau)) {
    return 'Enter your expected monthly active users as a number.';
  }
  if (Number(mau) > EXPECTED_MAU_MAX) {
    return 'Enter no more than 4,294,967,295 expected monthly active users.';
  }
  if (Number(mau) <= DEVELOPMENT_SEAT_LIMIT) {
    return `Apps for you and up to ${DEVELOPMENT_SEAT_LIMIT} people stay on Development: invite them as testers instead. Production is for apps open to more people.`;
  }

  return null;
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
    ['privacyUrl', privacyIssue(draft)],
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
