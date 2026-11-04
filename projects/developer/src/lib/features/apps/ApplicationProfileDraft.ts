import type { ProductionSignIn } from './ProductionSignIn.ts';

export type ApplicationProfileDraft = {
  summary: string;
  openSource: boolean;
  productLinks: string;
  privacyUrl: string;
  noticeLinks: string;
  expectedMau: string;
  signIn: ProductionSignIn;
  writesUserData: boolean;
  usesOtherData: boolean;
  otherDataSources: string;
  syncsElsewhere: boolean;
  otherSyncServices: string;
};
