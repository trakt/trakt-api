import { describe, expect, it } from 'vitest';
import { isStripeCheckoutUrl } from './isStripeCheckoutUrl.ts';

describe('isStripeCheckoutUrl', () => {
  it('accepts https URLs on stripe.com and its subdomains', () => {
    expect(isStripeCheckoutUrl('https://checkout.stripe.com/c/pay/cs_1')).toBe(
      true,
    );
    expect(isStripeCheckoutUrl('https://billing.stripe.com/p/session/x')).toBe(
      true,
    );
  });

  it('rejects other hosts, plain http, and lookalikes', () => {
    expect(isStripeCheckoutUrl('http://checkout.stripe.com/c/pay/cs_1')).toBe(
      false,
    );
    expect(isStripeCheckoutUrl('https://stripe.com.evil.example/')).toBe(false);
    expect(isStripeCheckoutUrl('https://example.com/stripe.com')).toBe(false);
    expect(isStripeCheckoutUrl('not a url')).toBe(false);
  });
});
