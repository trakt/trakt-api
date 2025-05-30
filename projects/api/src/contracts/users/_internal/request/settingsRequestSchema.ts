import { genreEnumSchema } from '../../../_internal/response/genreEnumSchema.ts';
import { z } from '../../../_internal/z.ts';

const spoilerEnumSchema = z.enum(['show', 'hide']);

const userSettingsSettingsSchema = z.object({
  name: z.string().nullish(),
  about: z.string().nullish(),
  private: z.boolean().nullish(),
});

const browsingSettingsSchema = z.object({
  genres: z.object({
    favorites: z.array(genreEnumSchema).nullish(),
    disliked: z.array(genreEnumSchema).nullish(),
  }).nullish(),
  spoilers: z.object({
    episodes: spoilerEnumSchema.nullish(),
    shows: spoilerEnumSchema.nullish(),
    movies: spoilerEnumSchema.nullish(),
  }).nullish(),
  watchnow: z.object({
    country: z.string().nullish(),
    favorites: z.array(z.string()).nullish(),
    only_favorites: z.boolean().nullish(),
  }).nullish(),
});

export const settingsRequestSchema = z.object({
  user: userSettingsSettingsSchema.nullish(),
  browsing: browsingSettingsSchema.nullish(),
});
