import { z } from 'zod';
import { isStripeCheckoutUrl } from './isStripeCheckoutUrl.ts';

export const checkoutUrlSchema = z.object({
  checkout_url: z.string().refine(isStripeCheckoutUrl),
});
