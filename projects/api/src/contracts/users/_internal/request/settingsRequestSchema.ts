import { genreEnumSchema } from '../../../_internal/response/genreEnumSchema.ts';
import { z } from '../../../_internal/z.ts';

const spoilerEnumSchema = z.enum(['show', 'hide']);

const userSettingsSettingsSchema = z.object({
  name: z.string().optional(),
  about: z.string().optional(),
  private: z.boolean().optional(),
});

const browsingSettingsSchema = z.object({
  genres: z.object({
    favorites: z.array(genreEnumSchema).optional(),
    disliked: z.array(genreEnumSchema).optional(),
  }).optional(),
  spoilers: z.object({
    episodes: spoilerEnumSchema.optional(),
    shows: spoilerEnumSchema.optional(),
    movies: spoilerEnumSchema.optional(),
  }).optional(),
  watchnow: z.object({
    country: z.string().optional(),
    favorites: z.array(z.string()).optional(),
    only_favorites: z.boolean().optional(),
  }).optional(),
});

export const settingsRequestSchema = z.object({
  user: userSettingsSettingsSchema.optional(),
  browsing: browsingSettingsSchema.optional(),
});
