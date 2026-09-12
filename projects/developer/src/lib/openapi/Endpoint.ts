import type { EndpointParameter } from './EndpointParameter.ts';
import type { HttpMethod } from './HttpMethod.ts';

export type EndpointRequestBody = {
  required: boolean;
  description: string;
  contentType: string;
  example: string;
};

export type EndpointResponse = {
  status: string;
  description: string;
  contentType: string;
  example: string;
  requiredExample: string;
  headers?: ReadonlyArray<{
    name: string;
    description: string;
    example: string;
  }>;
};

export type Endpoint = {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  operationId: string;
  tags: ReadonlyArray<string>;
  deprecated: boolean;
  auth: 'endpoint' | 'optional' | 'required';
  parameters: ReadonlyArray<EndpointParameter>;
  requestBody: EndpointRequestBody | null;
  responses: ReadonlyArray<EndpointResponse>;
  serverUrls: ReadonlyArray<string>;
};
