import { z } from '../../../_internal/z.ts';

/** Zod schema for a year in review persona id. */
export const personaIdSchema = z.enum([
  'anime-voyager',
  'day-one-devotee',
  'weekend-marathoner',
  'comfort-rewatcher',
  'omnivore',
  'opening-night',
  'cinephile',
  'critic',
  'loyalist',
  'curator',
  'wildcard',
  'opening-act',
]);

/** Zod schema for a year in review persona trait id. */
export const personaTraitIdSchema = z.enum([
  'streak-keeper',
  'night-owl',
  'early-bird',
  'weekend-warrior',
  'time-traveler',
  'globetrotter',
  'social-butterfly',
  'automaton',
  'app-hopper',
  'silent-watcher',
  'hype-machine',
  'tough-crowd',
  'polariser',
  'live-checker',
  'doc-nerd',
  'horror-hound',
  'fresh-start',
]);

/** Zod schema for a year in review persona highlight kind. */
export const personaHighlightKindSchema = z.enum([
  'anime-episodes',
  'anime-share',
  'streak-days',
  'premiere-share',
  'premieres',
  'weekend-share',
  'binge-days',
  'plays-per-day',
  'catalog-share',
  'top-show-episodes',
  'apps',
  'shows',
  'networks',
  'checkin-share',
  'new-releases',
  'avg-runtime',
  'avg-vintage',
  'pre-2000',
  'ratings',
  'avg-rating',
  'perfect-tens',
  'top-show-share',
  'genre-share',
  'movies',
  'plays',
  'personas-in-range',
]);

const personaHighlightSchema = z.object({
  kind: personaHighlightKindSchema,
  value: z.number(),
});

const personaScoreSchema = z.number().int().min(0).max(100);

const personaScoresSchema = z.object(
  Object.fromEntries(
    personaIdSchema.options.map((id) => [id, personaScoreSchema]),
  ) as Record<z.infer<typeof personaIdSchema>, typeof personaScoreSchema>,
);

/** Zod schema for the year in review persona response. */
export const yearInReviewPersonaResponseSchema = z.object({
  persona: personaIdSchema,
  runner_up: personaIdSchema.nullable(),
  confidence: z.enum(['strong', 'leaning']),
  rarity: z.number().int().min(0).max(100).openapi({
    description: 'How rare the persona is, as a percentage from 0 to 100.',
  }),
  card_number: z.number().int().min(1).max(12),
  traits: personaTraitIdSchema.array().max(3),
  highlights: personaHighlightSchema.array().max(3),
  runner_up_highlights: personaHighlightSchema.array().max(3),
  scores: personaScoresSchema.openapi({
    description: 'Score from 0 to 100 for every persona.',
  }),
  streak: z.object({
    longest: z.number().int(),
    started_at: z.string().datetime().nullable(),
  }),
  monthly: z.object({
    month: z.number().int().min(1).max(12),
    persona: personaIdSchema,
  }).array(),
});

/** Zod schema for the year in review persona bad request response. */
export const yearInReviewPersonaBadRequestResponseSchema = z.object({
  error: z.enum(['invalid_year', 'invalid_user_slug']),
});

/** Zod schema for the year in review persona VIP required response. */
export const yearInReviewPersonaForbiddenResponseSchema = z.object({
  error: z.literal('vip_required'),
});

/** Zod schema for the year in review persona not found response. */
export const yearInReviewPersonaNotFoundResponseSchema = z.object({
  error: z.literal('persona_not_found'),
});
