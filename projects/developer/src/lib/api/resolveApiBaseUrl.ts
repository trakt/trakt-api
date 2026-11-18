const DEFAULT_API_BASE_URL = 'https://api.trakt.tv';

/** The API origin to call, falling back to production when none is configured. */
export function resolveApiBaseUrl(configured: string | undefined): string {
  const trimmed = configured?.trim().replace(/\/+$/, '');

  return trimmed ? trimmed : DEFAULT_API_BASE_URL;
}
