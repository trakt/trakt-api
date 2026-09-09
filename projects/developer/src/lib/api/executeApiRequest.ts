import type {
  ApiExecutionRequest,
  ApiExecutionResponse,
} from './ApiExecution.ts';

export async function executeApiRequest(
  request: ApiExecutionRequest,
): Promise<ApiExecutionResponse> {
  const response = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(request),
  });

  const result = await response.json().catch(() => null) as
    | ApiExecutionResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    const message = result && 'message' in result ? result.message : undefined;
    throw new Error(
      message ?? `Request failed with status ${response.status}.`,
    );
  }

  return result as ApiExecutionResponse;
}
