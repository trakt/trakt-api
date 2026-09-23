import type { ApiHeader } from './ApiHeader.ts';
import type { HttpMethod } from '$lib/openapi/HttpMethod.ts';

export type ApiExecutionRequest = {
  method: HttpMethod;
  url: string;
  headers: ReadonlyArray<ApiHeader>;
  body: string;
  accountSlot: number | null;
};
