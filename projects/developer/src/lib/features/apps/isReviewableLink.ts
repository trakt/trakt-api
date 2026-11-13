const BLOCKED_HOSTS: ReadonlyArray<string> = [
  'example.com',
  'example.org',
  'example.net',
  'localhost',
  'trakt.tv',
  'imgur.com',
];

const BLOCKED_SUFFIXES: ReadonlyArray<string> = ['.local', '.test', '.invalid'];

const IP_ADDRESS = /^(\d{1,3}(\.\d{1,3}){3}|\[.*\])$/;

/** Whether a reviewer can open the link and learn about the app from it. */
export function isReviewableLink(value: string): boolean {
  if (!URL.canParse(value)) return false;

  const host = new URL(value).hostname.toLowerCase();
  if (IP_ADDRESS.test(host)) return false;

  const labels = host.split('.');
  if (labels.length < 2 || labels.some((label) => label === '')) return false;
  if (BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) return false;

  return !BLOCKED_HOSTS.some(
    (blocked) => host === blocked || host.endsWith(`.${blocked}`),
  );
}
