import type { LinkReport } from './LinkReport.ts';

type LinkReportProblems = {
  blocking: string[];
  warnings: string[];
};

/**
 * What a link check means for the developer: links that never opened stop the
 * request, missing wording is a warning they can fix or send anyway.
 */
export function linkReportProblems(
  report: LinkReport,
  appName: string,
): LinkReportProblems {
  const dead = [
    ...new Set(
      report.links
        .filter(({ state }) => state === 'dead')
        .map(({ url }) => url),
    ),
  ];

  return {
    blocking: dead.map(
      (url) => `We couldn't open ${url}. Fix or remove it, then submit again.`,
    ),
    warnings: [
      report.notice_found === false
        ? `We couldn't find "${appName} uses Trakt but is not endorsed or certified by Trakt" on your notice links. Requests without it are sent back.`
        : null,
      report.notice_is_media
        ? 'Your notice proof is an image or a video, so a person checks it before your app goes live. A link to a page with the notice is faster.'
        : null,
      report.privacy_mentions_trakt === false
        ? "Your privacy policy doesn't mention Trakt. Say what your app sends to Trakt and how to disconnect."
        : null,
    ].filter((warning) => warning !== null),
  };
}
