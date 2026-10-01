export type PageMetaTag = {
  element: 'meta' | 'link';
  key: { name: string; value: string };
  attribute: 'content' | 'href';
  value: string;
};
