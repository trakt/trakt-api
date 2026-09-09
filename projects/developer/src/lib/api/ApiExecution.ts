import type { ApiHeader } from './ApiHeader.ts';
import type { HttpMethod } from '$lib/openapi/HttpMethod.ts';

export type ApiExecutionRequest = {
  method: HttpMethod;
  url: string;
  headers: ReadonlyArray<ApiHeader>;
  body: string;
  accountSlot: number | null;
};

export type ApiExecutionResponse = {
  status: number;
  statusText: string;
  durationMs: number;
  size: number;
  headers: ReadonlyArray<{ name: string; value: string }>;
  body: string;
  isJson: boolean;
};
