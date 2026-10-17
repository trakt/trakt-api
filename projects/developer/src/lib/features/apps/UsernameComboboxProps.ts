import type { FollowedUser } from './FollowedUser.ts';

export type UsernameComboboxProps = {
  value: string;
  suggestions: ReadonlyArray<FollowedUser>;
  disabled: boolean;
};
