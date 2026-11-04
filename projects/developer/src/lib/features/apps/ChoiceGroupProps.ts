export type ChoiceGroupProps<T extends string> = {
  legend: string;
  name: string;
  options: readonly { value: T; label: string; hint?: string }[];
  value: T;
  hint?: string;
};
