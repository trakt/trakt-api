import { z } from 'zod';

export const linkReportSchema = z.object({
  links: z.array(
    z.object({
      field: z.enum(['product_links', 'privacy_url', 'notice_links']),
      url: z.string(),
      state: z.enum(['ok', 'dead', 'unconfirmed']),
    }),
  ),
  notice_found: z.boolean().nullable(),
  privacy_mentions_trakt: z.boolean().nullable(),
});
