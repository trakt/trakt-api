import { ACCOUNT_LIMIT } from '$lib/server/accountCookie.ts';
import { readAccountSession } from '$lib/server/readAccountSession.ts';
import { privateJson } from '$lib/server/privateJson.ts';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
  const sessions = await Promise.all(
    Array.from(
      { length: ACCOUNT_LIMIT },
      (_, slot) =>
        readAccountSession({ cookies, slot }).then((session) => ({
          slot,
          session,
        })),
    ),
  );

  const now = Math.floor(Date.now() / 1000);
  const accounts = sessions.flatMap(({ slot, session }) =>
    session
      ? [{
        slot,
        username: session.username,
        expiresAt: session.expiresAt,
        isExpired: session.expiresAt <= now,
        source: 'developer-oauth' as const,
      }]
      : []
  );

  return privateJson({ accounts });
};
