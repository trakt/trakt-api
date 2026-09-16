import type { ApplicationPageProps } from './ApplicationPageProps.ts';

type ApplicationMode = ApplicationPageProps['mode'];

export function applicationTitle(
  mode: ApplicationMode,
  displayName: string,
): string {
  switch (mode) {
    case 'list':
      return 'My Apps';
    case 'new':
      return 'Create an app';
    case 'edit':
      return `Edit ${displayName}`;
    case 'detail':
      return displayName;
  }
}

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
