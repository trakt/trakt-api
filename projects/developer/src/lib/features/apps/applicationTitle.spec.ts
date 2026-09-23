import { expect, it } from 'vitest';
import { applicationCrumb } from './applicationCrumb.ts';
import { applicationTitle } from './applicationTitle.ts';

it.each(
  [
    ['list', 'My Apps', 'My Apps'],
    ['new', 'Create an app', 'Create app'],
    ['edit', 'Edit My App', 'Edit'],
    ['detail', 'My App', 'My App'],
  ] as const,
)(
  'names the %s view consistently in the title and breadcrumb',
  (mode, title, crumb) => {
    expect(applicationTitle(mode, 'My App')).toBe(title);
    expect(applicationCrumb(mode, 'My App')).toBe(crumb);
  },
);
