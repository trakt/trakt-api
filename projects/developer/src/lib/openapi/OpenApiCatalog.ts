import type { Endpoint } from './Endpoint.ts';

export type OpenApiCatalog = {
  title: string;
  apiVersion: string;
  openApiVersion: string;
  source: string;
  endpoints: ReadonlyArray<Endpoint>;
};
