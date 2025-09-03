import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import { codeRequestSchema } from './schema/request/codeRequestSchema.ts';
import {
  deviceTokenRequestSchema,
} from './schema/request/deviceTokenRequestSchema.ts';
import { tokenRefreshSchema } from './schema/request/tokenRefreshSchema.ts';
import { tokenRequestSchema } from './schema/request/tokenRequestSchema.ts';
import { codeResponseSchema } from './schema/response/codeResponseSchema.ts';
import { tokenResponseSchema } from './schema/response/tokenResponseSchema.ts';

const device = builder.router({
  code: {
    method: 'POST',
    path: '/code',
    body: codeRequestSchema,
    responses: {
      200: codeResponseSchema,
    },
  },
  token: {
    path: '/token',
    method: 'POST',
    body: deviceTokenRequestSchema,
    responses: {
      200: tokenResponseSchema,
      400: z.undefined(),
    },
  },
}, {
  pathPrefix: '/device',
});

export { codeRequestSchema };
export type OAuthDeviceCodeRequest = z.infer<typeof codeRequestSchema>;

export { codeResponseSchema };
export type OAuthDeviceCodeResponse = z.infer<typeof codeResponseSchema>;

export { deviceTokenRequestSchema };
export type OAuthDeviceTokenRequest = z.infer<typeof deviceTokenRequestSchema>;

export { tokenRequestSchema };
export type OAuthTokenRequest = z.infer<typeof tokenRequestSchema>;

export { tokenRefreshSchema };
export type OAuthTokenRefresh = z.infer<typeof tokenRefreshSchema>;

export { tokenResponseSchema };
export type OAuthTokenResponse = z.infer<typeof tokenResponseSchema>;

export const oauth = builder
  .router({
    device,
    token: {
      path: '/token',
      method: 'POST',
      body: z.union([
        tokenRequestSchema,
        tokenRefreshSchema,
      ]),
      responses: {
        200: tokenResponseSchema,
        400: z.undefined(),
      },
    },
  }, {
    pathPrefix: '/oauth',
  });
