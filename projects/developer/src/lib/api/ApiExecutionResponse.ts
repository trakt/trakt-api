export type ApiExecutionResponse = {
  status: number;
  statusText: string;
  durationMs: number;
  size: number;
  headers: ReadonlyArray<{ name: string; value: string }>;
  body: string;
  isJson: boolean;
};
