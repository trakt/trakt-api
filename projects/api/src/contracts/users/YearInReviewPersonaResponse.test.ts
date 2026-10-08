import { assertType, type IsExact } from '@std/testing/types';

import type { YearInReviewPersonaResponse } from './index.ts';

Deno.test('@types/YearInReviewPersonaResponse: complete persona response', () => {
  const persona: YearInReviewPersonaResponse = {
    persona: 'cinephile',
    runner_up: null,
    confidence: 'strong',
    rarity: 12,
    card_number: 7,
    traits: ['night-owl'],
    highlights: [{ kind: 'movies', value: 120 }],
    runner_up_highlights: [],
    scores: {
      'anime-voyager': 0,
      'day-one-devotee': 5,
      'weekend-marathoner': 10,
      'comfort-rewatcher': 15,
      'omnivore': 20,
      'opening-night': 25,
      'cinephile': 90,
      'critic': 30,
      'loyalist': 35,
      'curator': 40,
      'wildcard': 45,
      'opening-act': 50,
    },
    streak: { longest: 14, started_at: null },
    monthly: [{ month: 1, persona: 'critic' }],
  };

  assertType<
    IsExact<typeof persona.runner_up, YearInReviewPersonaResponse['runner_up']>
  >(true);
  assertType<IsExact<typeof persona.confidence, 'strong' | 'leaning'>>(true);
  assertType<
    IsExact<YearInReviewPersonaResponse['scores']['cinephile'], number>
  >(true);
});
