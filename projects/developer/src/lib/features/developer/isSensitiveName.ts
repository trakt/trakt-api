const SENSITIVE_NAME_PATTERN =
  /(?:^|[-_])(api[-_]?key|access[-_]?token|refresh[-_]?token|auth(?:orization)?|client[-_]?(?:id|secret)|cookie|password|secret|token)(?:$|[-_])/i;

export function isSensitiveName(name: string): boolean {
  return SENSITIVE_NAME_PATTERN.test(name.trim());
}
