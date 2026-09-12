export const MANAGED_AUTHORIZATION_HEADER_ID = 'managed-authorization';

export function parameterHeaderId(parameterId: string): string {
  return `parameter:${parameterId}`;
}
