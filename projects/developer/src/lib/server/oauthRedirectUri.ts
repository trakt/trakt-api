import { env } from '$env/dynamic/private';
import { publicOrigin } from './publicOrigin.ts';

export function oauthRedirectUri({ requestUrl }: { requestUrl: URL }): string {
  const origin = publicOrigin({
    configuredOrigin: env.DEVELOPER_ORIGIN,
    requestUrl,
  });

  return `${origin}/auth/callback`;
}
