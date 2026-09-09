export type EndpointParameter = {
  id: string;
  name: string;
  location: 'path' | 'query' | 'header';
  required: boolean;
  description: string;
  type: string;
  enumValues: ReadonlyArray<string>;
  defaultValue: string;
};
