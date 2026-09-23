import type { Application } from './Application.ts';
import type { ApplicationInput } from './ApplicationInput.ts';

export type ApplicationFormProps = {
  app?: Application;
  githubUsername?: string | null;
  busy: boolean;
  onSave: (input: ApplicationInput) => void;
  onCancel: () => void;
};
