import { NAME_HINT_LIMIT } from './NAME_HINT_LIMIT.ts';

export function applicationNameFrom(url: URL): string | undefined {
  return url.searchParams.get('name')?.trim().slice(0, NAME_HINT_LIMIT);
}
