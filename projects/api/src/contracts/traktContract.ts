import { builder } from './_internal/builder.ts';
import { calendars } from './calendars/index.ts';
import { certifications } from './certifications/index.ts';
import { checkin } from './checkin/index.ts';
import { comments } from './comments/index.ts';
import { countries } from './countries/index.ts';
import { episodes } from './episodes/index.ts';
import { genres } from './genres/index.ts';
import { languages } from './languages/index.ts';
import { lists } from './lists/index.ts';
import { media } from './media/index.ts';
import { movies } from './movies/index.ts';
import { networks } from './networks/index.ts';
import { notes } from './notes/index.ts';
import { oauth } from './oauth/index.ts';
import { people } from './people/index.ts';
import { recommendations } from './recommendations/index.ts';
import { scrobble } from './scrobble/index.ts';
import { search } from './search/index.ts';
import { seasons } from './seasons/index.ts';
import { shows } from './shows/index.ts';
import { smartLists } from './smart_lists/index.ts';
import { social_recommendations } from './social_recommendations/index.ts';
import { sync } from './sync/index.ts';
import { team } from './team/index.ts';
import { users } from './users/index.ts';
import { watchnow } from './watchnow/index.ts';
import { younify } from './younify/index.ts';

export const traktContract = builder
  .router({
    oauth,
    calendars,
    checkin,
    users,
    sync,
    recommendations,
    social_recommendations,
    media,
    movies,
    notes,
    shows,
    search,
    people,
    watchnow,
    seasons,
    episodes,
    lists,
    smart_lists: smartLists,
    comments,
    certifications,
    countries,
    genres,
    languages,
    networks,
    scrobble,
    team,
    younify,
  });
