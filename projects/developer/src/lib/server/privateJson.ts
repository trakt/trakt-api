import { json } from '@sveltejs/kit';

export function privateJson(payload: unknown): Response {
  return json(payload, { headers: { 'cache-control': 'private, no-store' } });
}
