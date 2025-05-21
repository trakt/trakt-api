import { z } from '../z.ts';
import { characterResponseSchema } from './characterResponseSchema.ts';
import { crewPositionResponseSchema } from './crewPositionResponseSchema.ts';
import { jobsResponseSchema } from './jobsResponseSchema.ts';

const headshotSchema = z.object({
  headshot: z.array(z.string()),
});

const personSchema = z.object({
  name: z.string(),
  ids: z.object({
    trakt: z.number().int(),
    slug: z.string(),
    imdb: z.string().nullable(),
    tmdb: z.number().int().nullable(),
  }),
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.extend({
    fanart: z.array(z.string()),
  }).optional(),
});

export const castSchema = z.object({
  episode_count: z.number().int().optional(),
  person: personSchema,
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.optional(),
}).merge(characterResponseSchema);

export const crewSchema = z.object({
  person: personSchema,
  episode_count: z.number().int().optional(),
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.optional(),
}).merge(jobsResponseSchema);

export const peopleResponseSchema = z.object({
  cast: z.array(castSchema).optional(),
  crew: z.record(
    crewPositionResponseSchema,
    z.array(crewSchema),
  ).optional(),
});
