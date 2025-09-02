import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import type { z } from '../_internal/z.ts';
import { episodeScrobbleRequestSchema } from './schema/request/episodeScrobbleRequestSchema.ts';
import { movieScrobbleRequestSchema } from './schema/request/movieScrobbleRequestSchema.ts';
import { episodeScrobbleResponseSchema } from './schema/response/episodeScrobbleResponseSchema.ts';
import { movieScrobbleResponseSchema } from './schema/response/movieScrobbleResponseSchema.ts';

export const scrobble = builder.router({
  movie: builder.router({
    start: {
      path: '/start',
      method: 'POST',
      body: movieScrobbleRequestSchema,
      query: extendedQuerySchemaFactory<['full', 'images']>(),
      responses: {
        201: movieScrobbleResponseSchema,
      },
    },
    pause: {
      path: '/pause',
      method: 'POST',
      body: movieScrobbleRequestSchema,
      query: extendedQuerySchemaFactory<['full', 'images']>(),
      responses: {
        201: movieScrobbleResponseSchema,
      },
    },
    stop: {
      path: '/stop',
      method: 'POST',
      body: movieScrobbleRequestSchema,
      query: extendedQuerySchemaFactory<['full', 'images']>(),
      responses: {
        201: movieScrobbleResponseSchema,
      },
    },
  }),
  episode: builder.router({
    start: {
      path: '/start',
      method: 'POST',
      body: episodeScrobbleRequestSchema,
      query: extendedQuerySchemaFactory<['full', 'images']>(),
      responses: {
        201: episodeScrobbleResponseSchema,
      },
    },
    pause: {
      path: '/pause',
      method: 'POST',
      body: episodeScrobbleRequestSchema,
      query: extendedQuerySchemaFactory<['full', 'images']>(),
      responses: {
        201: episodeScrobbleResponseSchema,
      },
    },
    stop: {
      path: '/stop',
      method: 'POST',
      body: episodeScrobbleRequestSchema,
      query: extendedQuerySchemaFactory<['full', 'images']>(),
      responses: {
        201: episodeScrobbleResponseSchema,
      },
    },
  }),
}, { pathPrefix: '/scrobble' });

export type MovieScrobbleRequest = z.infer<typeof movieScrobbleRequestSchema>;
export type MovieScrobbleResponse = z.infer<typeof movieScrobbleRequestSchema>;
export type EpisodeScrobbleRequest = z.infer<
  typeof episodeScrobbleRequestSchema
>;
export type EpisodeScrobbleResponse = z.infer<
  typeof episodeScrobbleRequestSchema
>;
