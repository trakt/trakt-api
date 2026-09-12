import type { Endpoint } from './Endpoint.ts';

function searchableText(endpoint: Endpoint): string {
  return [
    endpoint.path,
    endpoint.summary,
    endpoint.operationId,
  ].join(' ').toLocaleLowerCase();
}

export function filterEndpoints({
  endpoints,
  query,
}: {
  endpoints: ReadonlyArray<Endpoint>;
  query: string;
}): ReadonlyArray<Endpoint> {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return endpoints;

  return endpoints.filter((endpoint) => {
    const searchable = searchableText(endpoint);
    return terms.every((term) => searchable.includes(term));
  });
}
