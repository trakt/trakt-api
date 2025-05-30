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
    imdb: z.string().nullish(),
    tmdb: z.number().int().nullish(),
  }),
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.extend({
    fanart: z.array(z.string()),
  }).nullish(),
});

export const castSchema = z.object({
  episode_count: z.number().int().nullish(),
  person: personSchema,
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.nullish(),
}).merge(characterResponseSchema);

export const crewSchema = z.object({
  person: personSchema,
  episode_count: z.number().int().nullish(),
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.nullish(),
}).merge(jobsResponseSchema);

export const peopleResponseSchema = z.object({
  cast: z.array(castSchema).nullish(),
  crew: z.record(
    crewPositionResponseSchema,
    z.array(crewSchema),
  ).nullish(),
});
