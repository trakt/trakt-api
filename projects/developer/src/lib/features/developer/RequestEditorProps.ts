import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';

export type RequestEditorTab = 'params' | 'headers' | 'body';

export type RequestEditorProps = {
  endpoint: Endpoint;
  url: string;
  serverUrl: string;
  showServerOverride: boolean;
  values: Readonly<Record<string, string>>;
  headers: ReadonlyArray<ApiHeader>;
  body: string;
  activeTab: RequestEditorTab;
  isSending: boolean;
  errorMessage: string;
  onServer: (value: string) => void;
  onValue: (id: string, value: string) => void;
  onHeader: (
    id: string,
    field: 'name' | 'value' | 'enabled',
    value: string | boolean,
  ) => void;
  onAddHeader: () => void;
  onRemoveHeader: (id: string) => void;
  onBody: (value: string) => void;
  onTab: (tab: RequestEditorTab) => void;
  onSend: () => void;
};
