export function operationLink(operationId: string): string {
  return `/?section=reference&operation=${encodeURIComponent(operationId)}`;
}
