import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import type { RequestEditorTab } from './RequestEditorTab.ts';

export type RequestUrlState = {
  endpointId: string;
  mainServerUrl: string;
  serverUrl: string;
  values: Readonly<Record<string, string>>;
  headers: ReadonlyArray<ApiHeader>;
  authorizationEnabled: boolean;
  body: string;
  activeTab: RequestEditorTab | null;
};
