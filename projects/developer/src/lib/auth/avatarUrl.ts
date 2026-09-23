export function avatarUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const trimmed = value.trim();
  try {
    const url = new URL(
      trimmed.includes('://')
        ? trimmed
        : `https://${trimmed.replace(/^\/\//, '')}`,
    );
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      !['media.trakt.tv', 'walter.trakt.tv'].includes(url.hostname) ||
      url.username || url.password || url.port
    ) return null;
    url.protocol = 'https:';
    return url.href;
  } catch {
    return null;
  }
}
