import type { ApplicationMode } from './ApplicationMode.ts';

export function applicationCrumb(
  mode: ApplicationMode,
  displayName: string,
): string {
  switch (mode) {
    case 'list':
      return 'My Apps';
    case 'new':
      return 'Create app';
    case 'edit':
      return 'Edit';
    case 'detail':
      return displayName;
  }
}
