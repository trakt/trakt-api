export type ManagersPanelProps = {
  slot: number;
  appId: number;
  ownerUsername: string;
  isOwner: boolean;
  onCountChange: (count: number) => void;
};
