import type { ProductionFormField } from './ProductionFormField.ts';

export type ProductionFormIssue = {
  field: ProductionFormField;
  message: string;
};
