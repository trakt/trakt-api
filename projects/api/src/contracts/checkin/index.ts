import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import { movieCheckinRequestSchema } from './schema/request/movieCheckinRequestSchema.ts';
import { showCheckinRequestSchema } from './schema/request/showCheckinRequestSchema.ts';
import { checkin409ErrorResponse } from './schema/response/checkin409ErrorResponse.ts';
import { movieCheckinResponseSchema } from './schema/response/movieCheckinResponseSchema.ts';
import { showCheckinResponseSchema } from './schema/response/showCheckinResponseSchema.ts';

export const checkin = builder.router({
  start: {
    method: 'POST',
    path: '',
    body: z.union([showCheckinRequestSchema, movieCheckinRequestSchema]),
    responses: {
      200: z.union([showCheckinResponseSchema, movieCheckinResponseSchema]),
      409: checkin409ErrorResponse,
    },
  },
  delete: {
    path: '',
    method: 'DELETE',
    responses: {
      204: z.undefined(),
    },
  },
}, { pathPrefix: '/checkin' });

export { showCheckinRequestSchema };
export type ShowCheckinRequest = z.infer<typeof showCheckinRequestSchema>;

export { showCheckinResponseSchema };
export type ShowCheckinResponse = z.infer<typeof showCheckinResponseSchema>;

export { movieCheckinRequestSchema };
export type MovieCheckinRequest = z.infer<typeof movieCheckinRequestSchema>;

export { movieCheckinResponseSchema };
export type MovieCheckinResponse = z.infer<typeof movieCheckinResponseSchema>;

export { checkin409ErrorResponse };
export type Checkin409ErrorResponse = z.infer<typeof checkin409ErrorResponse>;
