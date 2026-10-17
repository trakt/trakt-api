export type MembersPanelProps = {
  slot: number;
  appId: number;
  dev: boolean;
  isOwner: boolean;
  ownerUsername: string;
  onCountChange: (count: number) => void;
};
