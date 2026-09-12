export function formatTokenValidity(expiresAt: number, now: number): string {
  if (!Number.isFinite(expiresAt)) return 'Unknown';
  let remaining = Math.ceil(expiresAt - now / 1000);
  if (remaining <= 0) return 'Expired';

  const parts: string[] = [];
  for (
    const [size, unit] of [[86400, 'd'], [3600, 'h'], [60, 'm'], [
      1,
      's',
    ]] as const
  ) {
    const amount = Math.floor(remaining / size);
    remaining %= size;
    if (amount) parts.push(`${amount}${unit}`);
    if (parts.length === 2) break;
  }

  return parts.join(' ');
}
