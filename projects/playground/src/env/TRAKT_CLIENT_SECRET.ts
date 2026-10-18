import { assertDefined } from '../utils/assertDefined.ts';

export const TRAKT_CLIENT_SECRET = assertDefined(
  process.env.TRAKT_CLIENT_SECRET,
  'TRAKT_CLIENT_SECRET is not defined',
);
