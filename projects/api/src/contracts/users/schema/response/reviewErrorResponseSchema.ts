import { z } from '../../../_internal/z.ts';

/** Zod schema for the year and month in review bad request response. */
export const reviewBadRequestResponseSchema = z.object({
  error: z.enum(['invalid_user_slug', 'invalid_year', 'invalid_month']),
});

/** Zod schema for the year and month in review unauthorized response. */
export const reviewUnauthorizedResponseSchema = z.object({
  error: z.enum(['official_app_required', 'private_user']),
});

/** Zod schema for the year and month in review not found response. */
export const reviewNotFoundResponseSchema = z.object({
  error: z.enum(['user_not_found', 'review_not_ready']),
});

/** Zod schema for the year and month in review VIP required response. */
export const reviewUpgradeRequiredResponseSchema = z.object({
  error: z.literal('vip_required'),
});
