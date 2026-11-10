import { expect, test } from 'bun:test';

import { personAwardResponseSchema } from '../_internal/response/personAwardResponseSchema.ts';
import { smartListFiltersSchema } from '../_internal/request/smartListFiltersSchema.ts';
import { titleAwardResponseSchema } from '../_internal/response/titleAwardResponseSchema.ts';
import { upcomingCeremonyResponseSchema } from '../_internal/response/upcomingCeremonyResponseSchema.ts';
import { traktContract } from '../traktContract.ts';

const award = { slug: 'oscars-best-picture', name: 'Best Picture' };
const ceremony = {
  slug: 'oscars',
  name: 'Academy Awards',
  edition: 98,
  nominations_at: '2026-01-22',
  held_at: '2026-03-15',
};
const movie = {
  title: 'Oppenheimer',
  year: 2023,
  ids: { trakt: 1, slug: 'oppenheimer-2023' },
};
const show = {
  title: 'Shogun',
  year: 2024,
  ids: { trakt: 2, slug: 'shogun-2024' },
};
const person = { name: 'Cillian Murphy', ids: { trakt: 3, slug: 'cillian' } };

test('titleAwardResponseSchema: parses a title award and a person award with null result', () => {
  const entries = [
    { award, ceremony, year: 2024, won: true },
    { award, ceremony, year: 2025, won: null, person },
  ];

  const parsed = titleAwardResponseSchema.strict().array().parse(entries);

  expect(parsed).toEqual(entries);
});

test('titleAwardResponseSchema: keeps unscheduled ceremony fields as null', () => {
  const parsed = titleAwardResponseSchema.parse({
    award,
    ceremony: {
      ...ceremony,
      edition: null,
      nominations_at: null,
      held_at: null,
    },
    year: 2020,
    won: false,
  });

  expect(parsed.ceremony.held_at).toBeNull();
});

test('personAwardResponseSchema: parses a movie entry and a show entry', () => {
  const entries = [
    { award, ceremony, year: 2024, won: true, movie },
    { award, ceremony, year: 2025, won: null, show },
  ];

  const parsed = personAwardResponseSchema.array().parse(entries);

  expect(parsed).toEqual(entries);
});

test('upcomingCeremonyResponseSchema: parses an upcoming ceremony', () => {
  const entry = {
    slug: 'oscars',
    name: 'Academy Awards',
    edition: 99,
    year: 2027,
    nominations_at: null,
    held_at: '2027-03-14',
  };

  expect(upcomingCeremonyResponseSchema.strict().parse(entry)).toEqual(entry);
});

test('smartListFiltersSchema: accepts award filters', () => {
  const filters = {
    awards: ['oscars-best-picture'],
    award_years: [2020, 2026],
    award_won: true,
  };

  expect(smartListFiltersSchema.strict().parse(filters)).toEqual(filters);
});

test('traktContract: declares the awards routes', () => {
  expect(traktContract.awards.ceremonies.path).toBe('/awards/ceremonies');
  expect(traktContract.movies.awards.path).toBe('/movies/:id/awards');
  expect(traktContract.shows.awards.path).toBe('/shows/:id/awards');
  expect(traktContract.people.awards.path).toBe('/people/:id/awards');
});
