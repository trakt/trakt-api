import { movieResponseSchema } from './movieResponseSchema.ts';
import { showResponseSchema } from './showResponseSchema.ts';
import { z } from '../z.ts';

export const recommendationSubgenreSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const recommendationSourceSchema = z.object({
  id: z.number().describe('Trakt ID of the source item.'),
  stars: z.number().nullish().describe(
    'User rating of the source item, when rated.',
  ),
  type: z.string().describe(
    "Source type: 'favorite', 'activity', or 'subgenre'.",
  ),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  subgenres: z.array(recommendationSubgenreSchema).nullish(),
});
