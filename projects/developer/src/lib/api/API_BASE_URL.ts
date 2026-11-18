import { env } from '$env/dynamic/public';
import { resolveApiBaseUrl } from './resolveApiBaseUrl.ts';

/** The API the portal's own account requests go to. */
export const API_BASE_URL: string = resolveApiBaseUrl(env.PUBLIC_TRAKT_API_URL);
