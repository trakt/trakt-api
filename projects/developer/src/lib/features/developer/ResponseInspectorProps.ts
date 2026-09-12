import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import type { ResponseHistoryEntry } from './ResponseHistoryEntry.ts';

export type ResponseInspectorProps = {
  endpoint: Endpoint;
  history: ReadonlyArray<ResponseHistoryEntry>;
  isSending: boolean;
  onDeleteResponse: (id: string) => void;
};
