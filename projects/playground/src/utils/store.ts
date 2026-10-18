import { mkdir } from 'node:fs/promises';
import type { OAuthTokenResponse } from '@trakt/api';

const STORE_DIR = '.store';
const STORE_FILE = 'db.json';

export enum StoreKey {
  Auth = 'authorization',
}

type StoreKeyToValue = {
  [StoreKey.Auth]: OAuthTokenResponse;
};

export const store = await (async () => {
  const filePath = `${STORE_DIR}/${STORE_FILE}`;

  await mkdir(STORE_DIR, { recursive: true });

  const file = Bun.file(filePath);
  const dbRaw = await file.exists() ? await file.text() : '';
  const db = dbRaw.length ? JSON.parse(dbRaw) : {};

  return {
    get: (key: StoreKey) => db[key] as StoreKeyToValue[typeof key] | undefined,
    set: (key: StoreKey, value: StoreKeyToValue[typeof key]) => {
      db[key] = value;
      Bun.write(filePath, JSON.stringify(db));
    },
  };
})();
