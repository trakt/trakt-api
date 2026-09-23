import type { Application, ApplicationInput } from './applications.ts';

export type ApplicationFormProps = {
  app?: Application;
  githubUsername?: string | null;
  busy: boolean;
  onSave: (input: ApplicationInput) => void;
  onCancel: () => void;
};
