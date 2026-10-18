import type { OAuthTokenResponse, TraktApi } from '@trakt/api';
import { logger } from './utils/logger.ts';

export function createDeviceTokenPoller(api: TraktApi) {
  return async function ({
    client_id,
    client_secret,
  }: {
    client_id: string;
    client_secret: string;
  }): Promise<OAuthTokenResponse> {
    const codeResponse = await api.oauth.device.code({
      body: {
        client_id,
      },
    });

    if (codeResponse.status !== 200) {
      return Promise.reject(new Error(JSON.stringify(codeResponse.body)));
    }

    logger.statement(
      'The digital gods demand a sacrifice!',
      'No, not your firstborn, just a quick visit to this unholy URL:',
    );

    logger.output(
      `${codeResponse.body.verification_url}/${codeResponse.body.user_code}`,
    );

    return new Promise((resolve, reject) => {
      const codeExpiresAt = Date.now() + codeResponse.body.expires_in * 1000;

      const tokenInterval = setInterval(async () => {
        if (Date.now() > codeExpiresAt) {
          clearInterval(tokenInterval);
          const error = new Error(
            [
              'The code, a delicate snowflake, melted under the harsh glare of scrutiny',
              ', its potential extinguished before it could blossom into a token of authentication.',
            ].join(''),
          );

          reject(error);
        }

        const tokenResponse = await api.oauth.device
          .token({
            body: {
              code: codeResponse.body.device_code,
              client_id,
              client_secret,
            },
          })
          .catch(() => {
            // Trakt API does not return a correct body for 400 responses
            // throws error when trying to parse JSON
            return Promise.resolve({ status: 400, body: undefined } as {
              status: 400;
              body: undefined;
            });
          });

        if (tokenResponse.status === 200) {
          logger.statement(
            'The digital gods have spoken!',
            'A code has been issued!',
          );
          resolve(tokenResponse.body);
          clearInterval(tokenInterval);
        }
      }, codeResponse.body.interval * 1000);
    });
  };
}
