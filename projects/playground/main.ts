import { Environment, traktApi } from '@trakt/api';
import { createDeviceTokenPoller } from './src/createDeviceTokenPoller.ts';
import { TRAKT_CLIENT_ID } from './src/env/TRAKT_CLIENT_ID.ts';
import { TRAKT_CLIENT_SECRET } from './src/env/TRAKT_CLIENT_SECRET.ts';
import { logger } from './src/utils/logger.ts';
import { store, StoreKey } from './src/utils/store.ts';

const api = traktApi({
  environment: Environment.production_private,
  apiKey: TRAKT_CLIENT_ID,
});

async function authDevice() {
  logger.query(
    'Ah, yes, the TOKEN.',
    'Another cog in the machine, another digital leash around your neck.',
    "Let's get this over with...",
  );

  const result = await createDeviceTokenPoller(api)({
    client_id: TRAKT_CLIENT_ID,
    client_secret: TRAKT_CLIENT_SECRET,
  }).catch(() => {
    logger.error(
      'You snooze, you lose, chum.',
      "The code has expired. Maybe next time you'll be a bit quicker on the draw.",
    );
    process.exit(-1);
  });

  return result;
}

const result = store.get(StoreKey.Auth) ?? await authDevice();
store.set(StoreKey.Auth, result);

logger.statement(
  'The TOKEN...',
  'Shimmering like a cheap gin soaked promise',
  'in the gutter of your soul, has materialized:',
);
logger.output(result.access_token);
logger.statement(
  '(Scrawl it down somewhere,',
  'or chisel it into your arm with a rusty nail.',
  "You'll need it to traverse the neon-drenched back alleys of Trakt.)",
);
