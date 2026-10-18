import { expectTypeOf, test } from 'bun:test';

import { smartListTemplateResponseSchema } from '../_internal/response/smartListTemplateResponseSchema.ts';
import type { SmartListTemplateResponse } from '../../index.ts';

test('@types/SmartListTemplateResponse: non-personal template', () => {
  const template: SmartListTemplateResponse = {
    id: 'hidden-gems',
    source: 'discover',
    media_type: 'movies',
    filters: {
      ratings: [78],
      votes: [300, 3000],
      runtimes: [80],
      metascores: [65],
    },
    personal: false,
    total: 315,
    items: [{
      type: 'movie',
      rank: 1,
      movie: {
        title: 'Ne Zha 2',
        year: 2025,
        ids: { trakt: 787956, slug: 'ne-zha-2-2025' },
      },
    }],
  };

  expectTypeOf<typeof template>().toEqualTypeOf<SmartListTemplateResponse>();
  smartListTemplateResponseSchema.parse(template);
});

test('@types/SmartListTemplateResponse: personal template', () => {
  const template: SmartListTemplateResponse = {
    id: 'just-landed-services',
    source: 'discover',
    media_type: 'movies',
    filters: {
      released_within_days: 120,
      watchnow: ['subscriptions'],
      votes: [200],
    },
    personal: true,
    total: null,
    items: [],
  };

  smartListTemplateResponseSchema.parse(template);
});
