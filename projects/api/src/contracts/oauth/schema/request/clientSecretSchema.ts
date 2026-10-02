import { z } from '../../../_internal/z.ts';

/** Zod schema for the deprecated, optional `client_secret` of OAuth requests. */
export const clientSecretSchema = z.string({
  description:
    'Deprecated. Only send it from your own server, never from a website, mobile app, or desktop app.',
}).openapi({ deprecated: true }).optional();
