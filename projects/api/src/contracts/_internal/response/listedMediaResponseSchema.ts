import { z } from 'zod';
import { personResponseSchema } from '../../people/schema/response/personResponseSchema.ts';
import { seasonResponseSchema } from '../../shows/index.ts';
import { episodeResponseSchema } from './episodeResponseSchema.ts';
import { listMetadataResponseSchema } from './listMetadataResponseSchema.ts';
import { movieResponseSchema } from './movieResponseSchema.ts';
import { showResponseSchema } from './showResponseSchema.ts';

/**
 * A single item on a list, as one flat object with the shape-specific fields
 * nullish. Discriminate on `type`; seasons and episodes also carry their `show`.
 */
export const listedMediaResponseSchema = listMetadataResponseSchema
  .merge(z.object({
    type: z.enum(['movie', 'show']),
    movie: movieResponseSchema.nullish(),
    show: showResponseSchema.nullish(),
  }));

/**
 * A single item on a list of any type, as one flat object with the
 * shape-specific fields nullish. Discriminate on `type`; seasons and episodes
 * also carry their `show`.
 */
export const listedAllResponseSchema = listMetadataResponseSchema
  .merge(z.object({
    type: z.enum(['movie', 'show', 'season', 'episode', 'person']),
    movie: movieResponseSchema.nullish(),
    show: showResponseSchema.nullish(),
    season: seasonResponseSchema.nullish(),
    episode: episodeResponseSchema.nullish(),
    person: personResponseSchema.nullish(),
  }));
