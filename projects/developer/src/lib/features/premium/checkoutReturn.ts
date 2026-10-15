type CheckoutReturn =
  | { kind: 'success'; sessionId: string }
  | { kind: 'cancelled' }
  | null;

export function checkoutReturn(searchParams: URLSearchParams): CheckoutReturn {
  const sessionId = searchParams.get('session_id');
  if (sessionId) return { kind: 'success', sessionId };
  if (searchParams.get('checkout') === 'cancelled') {
    return { kind: 'cancelled' };
  }

  return null;
}
