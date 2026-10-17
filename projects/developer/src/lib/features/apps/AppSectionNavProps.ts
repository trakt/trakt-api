import type { AppSection } from './AppSection.ts';

export type AppSectionNavProps = {
  sections: ReadonlyArray<AppSection>;
  active: string;
};
