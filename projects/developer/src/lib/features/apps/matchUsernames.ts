import type { FollowedUser } from './FollowedUser.ts';

const SUGGESTION_LIMIT = 6;

export function matchUsernames(
  people: ReadonlyArray<FollowedUser>,
  query: string,
  excludedSlugs: ReadonlySet<string>,
): FollowedUser[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const available = people.filter((person) => !excludedSlugs.has(person.slug));
  const startsWith = available.filter((person) =>
    person.username.toLowerCase().startsWith(needle),
  );
  const contains = available.filter(
    (person) =>
      !person.username.toLowerCase().startsWith(needle) &&
      person.username.toLowerCase().includes(needle),
  );
  return [...startsWith, ...contains].slice(0, SUGGESTION_LIMIT);
}
