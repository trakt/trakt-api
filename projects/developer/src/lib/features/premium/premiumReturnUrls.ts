/** Where Stripe Checkout sends the browser back to; the API appends `session_id`. */
export function premiumReturnUrls(origin: string): {
  successUrl: string;
  cancelUrl: string;
} {
  return {
    successUrl: `${origin}/premium`,
    cancelUrl: `${origin}/premium?checkout=cancelled`,
  };
}
