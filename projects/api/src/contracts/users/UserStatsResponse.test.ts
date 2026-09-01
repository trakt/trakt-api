import { assertType, type IsExact } from '@std/testing/types';

import type { UserStatsResponse } from './index.ts';

Deno.test('@types/UserStatsResponse: complete stats response', () => {
  const stats: UserStatsResponse = {
    movies: {
      plays: 1845,
      watched: 1743,
      minutes: 206432,
      collected: 0,
      ratings: 438,
      comments: 46,
    },
    shows: {
      watched: 686,
      collected: 0,
      ratings: 98,
      comments: 10,
    },
    seasons: {
      ratings: 16,
      comments: 2,
    },
    episodes: {
      plays: 10628,
      watched: 10595,
      minutes: 412517,
      collected: 0,
      ratings: 276,
      comments: 88,
    },
    network: {
      friends: 19,
      followers: 731,
      following: 28,
    },
    ratings: {
      total: 828,
      distribution: {
        1: 0,
        2: 1,
        3: 0,
        4: 13,
        5: 39,
        6: 99,
        7: 159,
        8: 212,
        9: 184,
        10: 121,
      },
    },
    progress: {
      started: 388,
      finished: 276,
      dropped: 22,
    },
    lists: 31,
    total_minutes: 618949,
    total_plays: 12473,
  };

  assertType<IsExact<typeof stats, UserStatsResponse>>(true);
});
