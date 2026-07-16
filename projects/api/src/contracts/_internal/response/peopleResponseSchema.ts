import { personResponseSchema } from '../../people/schema/response/personResponseSchema.ts';
import { z } from '../z.ts';
import { characterResponseSchema } from './characterResponseSchema.ts';
import { crewPositionResponseSchema } from './crewPositionResponseSchema.ts';
import { jobsResponseSchema } from './jobsResponseSchema.ts';

const headshotSchema = z.object({
  headshot: z.array(z.string()),
});

/** Zod schema for the cast response. */
export const castResponseSchema = z.object({
  episode_count: z.number().int().nullish(),
  person: personResponseSchema,
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.nullish(),
}).merge(characterResponseSchema);

/** Zod schema for the crew response. */
export const crewResponseSchema = z.object({
  person: personResponseSchema,
  episode_count: z.number().int().nullish(),
  /***
   * Available if requesting extended `images`.
   */
  images: headshotSchema.nullish(),
}).merge(jobsResponseSchema);

/** Zod schema for the people response. */
export const peopleResponseSchema = z.object({
  cast: z.array(castResponseSchema).nullish(),
  crew: z.record(
    crewPositionResponseSchema,
    z.array(crewResponseSchema),
  ).nullish(),
});
