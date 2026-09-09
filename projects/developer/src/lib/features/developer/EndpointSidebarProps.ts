import type { Endpoint } from '$lib/openapi/Endpoint.ts';

export type EndpointSidebarProps = {
  endpoints: ReadonlyArray<Endpoint>;
  selectedId: string;
  query: string;
  isLoading: boolean;
  onQuery: (query: string) => void;
  onSelect: (endpoint: Endpoint) => void;
};
