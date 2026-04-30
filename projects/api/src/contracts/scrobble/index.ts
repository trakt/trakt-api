import { authMetadata, builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { z } from '../_internal/z.ts';
import { episodeScrobbleRequestSchema } from './schema/request/episodeScrobbleRequestSchema.ts';
import { movieScrobbleRequestSchema } from './schema/request/movieScrobbleRequestSchema.ts';
import { episodeScrobbleResponseSchema } from './schema/response/episodeScrobbleResponseSchema.ts';
import { movieScrobbleResponseSchema } from './schema/response/movieScrobbleResponseSchema.ts';

export const scrobble = builder.router({
  start: {
    path: '/start',
    method: 'POST',
    body: z.union([movieScrobbleRequestSchema, episodeScrobbleRequestSchema]),
    responses: {
      201: z.union([movieScrobbleResponseSchema, episodeScrobbleResponseSchema]),
    },
  },
  pause: {
    path: '/pause',
    method: 'POST',
    body: z.union([movieScrobbleRequestSchema, episodeScrobbleRequestSchema]),
    responses: {
      201: z.union([movieScrobbleResponseSchema, episodeScrobbleResponseSchema]),
    },
  },
  stop: {
    path: '/stop',
    method: 'POST',
    body: z.union([movieScrobbleRequestSchema, episodeScrobbleRequestSchema]),
    responses: {
      201: z.union([movieScrobbleResponseSchema, episodeScrobbleResponseSchema]),
    },
  },
}, {
  pathPrefix: '/scrobble',
  metadata: authMetadata('required'),
});

export {
  episodeScrobbleRequestSchema,
  episodeScrobbleResponseSchema,
  movieScrobbleRequestSchema,
  movieScrobbleResponseSchema,
};

export type MovieScrobbleRequest = z.infer<typeof movieScrobbleRequestSchema>;
export type MovieScrobbleResponse = z.infer<typeof movieScrobbleResponseSchema>;
export type EpisodeScrobbleRequest = z.infer<typeof episodeScrobbleRequestSchema>;
export type EpisodeScrobbleResponse = z.infer<typeof episodeScrobbleResponseSchema>;
