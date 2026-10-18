import { afterEach, describe, expect, it, vi } from 'vitest';
import { accessToken } from '$lib/auth/accessToken.ts';
import { cancelPremiumSubscription } from './cancelPremiumSubscription.ts';
import { confirmPremiumCheckout } from './confirmPremiumCheckout.ts';
import { fetchPremiumAmount } from './fetchPremiumAmount.ts';
import { startPremiumCheckout } from './startPremiumCheckout.ts';
import { updatePaymentMethodUrl } from './updatePaymentMethodUrl.ts';

vi.mock('$lib/auth/accessToken.ts', () => ({ accessToken: vi.fn() }));
vi.mock('$env/static/public', () => ({
  PUBLIC_TRAKT_CLIENT_ID: 'test-client',
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function stubFetch(response: Response) {
  const fetcher = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetcher);
  vi.mocked(accessToken).mockResolvedValue('test-token');
  return fetcher;
}

function requestOf(fetcher: ReturnType<typeof vi.fn>) {
  const call = fetcher.mock.calls.at(0);
  if (!call) throw new Error('fetch was not called');
  return { url: new URL(String(call[0])), init: call[1] as RequestInit };
}

const returnUrls = {
  successUrl: 'http://localhost:5174/premium',
  cancelUrl: 'http://localhost:5174/premium?checkout=cancelled',
};

describe('premium transport', () => {
  it('starts checkout with the monthly plan and both return URLs', async () => {
    const fetcher = stubFetch(
      Response.json({ checkout_url: 'https://checkout.stripe.com/c/pay/cs_1' }),
    );

    await expect(
      startPremiumCheckout({ slot: 1, ...returnUrls }),
    ).resolves.toBe('https://checkout.stripe.com/c/pay/cs_1');

    const { url, init } = requestOf(fetcher);
    expect(url.origin + url.pathname).toBe(
      'https://api.trakt.tv/developer/stripe/create',
    );
    expect(url.searchParams.get('duration')).toBe('monthly');
    expect(url.searchParams.get('success_url')).toBe(returnUrls.successUrl);
    expect(url.searchParams.get('cancel_url')).toBe(returnUrls.cancelUrl);
    expect(init.method).toBe('POST');
  });

  it('refuses a checkout URL that is not on stripe.com', async () => {
    stubFetch(Response.json({ checkout_url: 'https://example.com/pay' }));

    await expect(
      startPremiumCheckout({ slot: 1, ...returnUrls }),
    ).rejects.toThrow('Checkout could not be started');
  });

  it('confirms a session by id with no body', async () => {
    const fetcher = stubFetch(new Response(null, { status: 204 }));

    await expect(
      confirmPremiumCheckout({ slot: 2, sessionId: 'cs_1' }),
    ).resolves.toBeUndefined();

    const { url, init } = requestOf(fetcher);
    expect(url.pathname).toBe('/developer/stripe/confirm');
    expect(url.searchParams.get('session_id')).toBe('cs_1');
    expect(init.method).toBe('POST');
  });

  it('cancels with a plain POST', async () => {
    const fetcher = stubFetch(new Response(null, { status: 204 }));

    await cancelPremiumSubscription(3);

    const { url, init } = requestOf(fetcher);
    expect(url.pathname).toBe('/developer/stripe/cancel');
    expect(init.method).toBe('POST');
  });

  it('opens the card update session with return URLs', async () => {
    const fetcher = stubFetch(
      Response.json({ checkout_url: 'https://checkout.stripe.com/c/pay/cs_2' }),
    );

    await expect(
      updatePaymentMethodUrl({ slot: 1, ...returnUrls }),
    ).resolves.toBe('https://checkout.stripe.com/c/pay/cs_2');

    const { url } = requestOf(fetcher);
    expect(url.pathname).toBe('/developer/stripe/update');
    expect(url.searchParams.get('success_url')).toBe(returnUrls.successUrl);
  });

  it('reads the monthly amount from the plan list', async () => {
    stubFetch(
      Response.json([
        {
          plan_code: 'developer_premium_monthly',
          name: 'Developer Premium',
          duration: 'monthly',
          amount: 149,
        },
      ]),
    );

    await expect(fetchPremiumAmount(1)).resolves.toBe(149);
  });

  it('returns null when the plan list cannot be read', async () => {
    stubFetch(new Response('nope', { status: 500 }));

    await expect(fetchPremiumAmount(1)).resolves.toBeNull();
  });
});
