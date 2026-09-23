import type { Application } from './applications.ts';

const PERMISSION_LABELS: ReadonlyArray<
  readonly [keyof Application['permissions'], string]
> = [
  ['scrobble', 'Scrobble'],
  ['checkin', 'Check in'],
  ['account_create', 'Create accounts'],
];

export function applicationPermissionLabels(
  permissions: Application['permissions'],
): string {
  const labels = PERMISSION_LABELS.filter(([key]) => permissions[key]).map(
    ([, label]) => label,
  );

  return labels.join(', ') || 'No additional permissions';
}
