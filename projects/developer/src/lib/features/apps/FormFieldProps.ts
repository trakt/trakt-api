import type { Snippet } from 'svelte';
import type { FormFieldControlAttributes } from './FormFieldControlAttributes.ts';
import type { ProductionFormField } from './ProductionFormField.ts';

export type FormFieldProps = {
  uid: string;
  field: ProductionFormField;
  label: string | Snippet;
  hint?: string;
  warning?: string;
  error?: string;
  variant?: 'stacked' | 'check';
  size?: 'default' | 'small';
  control: Snippet<[FormFieldControlAttributes]>;
};
