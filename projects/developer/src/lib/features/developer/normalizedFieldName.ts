export function normalizedFieldName(value: string): string {
  return value.trim().toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, '_')
    .replaceAll(/^_+|_+$/g, '');
}
