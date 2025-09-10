import { personResponseSchema } from '../../people/schema/response/personResponseSchema.ts';
import { z } from '../z.ts';
import { characterResponseSchema } from './characterResponseSchema.ts';
import { crewPositionResponseSchema } from './crewPositionResponseSchema.ts';
import { jobsResponseSchema } from './jobsResponseSchema.ts';

const headshotSchema = z.object({
  headshot: z.array(z.string()),
});

export const castResponseSchema = z.object({
  episode_count: z.number().int().nullish(),
  person: personResponseSchema,
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.nullish(),
}).merge(characterResponseSchema);

export const crewResponseSchema = z.object({
  person: personResponseSchema,
  episode_count: z.number().int().nullish(),
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.nullish(),
}).merge(jobsResponseSchema);

export const peopleResponseSchema = z.object({
  cast: z.array(castResponseSchema).nullish(),
  crew: z.record(
    crewPositionResponseSchema,
    z.array(crewResponseSchema),
  ).nullish(),
});
