export function publicOrigin({
  configuredOrigin,
  requestUrl,
}: {
  configuredOrigin: string | undefined;
  requestUrl: URL;
}): string {
  if (configuredOrigin) {
    const configured = new URL(configuredOrigin);
    if (configured.protocol !== 'https:') {
      throw new Error('DEVELOPER_ORIGIN must use HTTPS.');
    }

    return configured.origin;
  }

  if (
    requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1'
  ) {
    return requestUrl.origin;
  }

  throw new Error('DEVELOPER_ORIGIN is not configured.');
}
