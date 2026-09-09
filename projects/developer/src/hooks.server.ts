import type { Handle, HandleServerError } from '@sveltejs/kit';

// Do not serialize or log upstream request errors, which can contain credentials.
export const handleError: HandleServerError = () => ({
  message: 'The developer could not complete this request.',
});

const SECURITY_HEADERS = {
  'cross-origin-opener-policy': 'same-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
} as const;

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const headers = new Headers(response.headers);
  Object.entries(SECURITY_HEADERS).forEach(([name, value]) =>
    headers.set(name, value)
  );

  headers.set('cache-control', 'private, no-store');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
