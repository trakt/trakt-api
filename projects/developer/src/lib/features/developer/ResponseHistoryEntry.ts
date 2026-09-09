import type { ApiExecutionResponse } from '$lib/api/ApiExecution.ts';
import type { HttpMethod } from '$lib/openapi/HttpMethod.ts';

export type ResponseHistoryEntry = {
  id: string;
  endpointId: string;
  sequence: number;
  receivedAt: string;
  request: {
    method: HttpMethod;
    url: string;
  };
  response: ApiExecutionResponse;
};
