import { env } from '$env/dynamic/public';

/** The GitHub OAuth app's client id, or an empty string when not configured. */
export const GITHUB_CLIENT_ID: string = env.PUBLIC_GITHUB_CLIENT_ID ?? '';
