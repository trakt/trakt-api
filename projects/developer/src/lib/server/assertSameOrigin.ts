import { error } from '@sveltejs/kit';

export function assertSameOrigin({
  request,
  url,
}: {
  request: Request;
  url: URL;
}): void {
  const origin = request.headers.get('origin');
  if (origin !== url.origin) {
    error(403, 'Cross-origin requests are not allowed.');
  }
}
