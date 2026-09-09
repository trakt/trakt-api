import type { OAuthSession } from './OAuthSession.ts';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(value: Uint8Array): string {
  const binary = value.reduce(
    (result, byte) => result + String.fromCharCode(byte),
    '',
  );

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll(
    '=',
    '',
  );
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padding = '='.repeat((4 - normalized.length % 4) % 4);

  return Uint8Array.from(
    atob(`${normalized}${padding}`),
    (character) => character.charCodeAt(0),
  );
}

async function deriveKey(secret: string): Promise<CryptoKey> {
  if (secret.length < 32) {
    throw new Error(
      'DEVELOPER_SESSION_SECRET must contain at least 32 characters.',
    );
  }

  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(secret));
  return crypto.subtle.importKey(
    'raw',
    digest,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptSession({
  session,
  secret,
}: {
  session: OAuthSession;
  secret: string;
}): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(secret);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(JSON.stringify(session)),
  );

  return `${toBase64Url(iv)}.${toBase64Url(new Uint8Array(encrypted))}`;
}

export async function decryptSession({
  value,
  secret,
}: {
  value: string;
  secret: string;
}): Promise<OAuthSession | null> {
  const [ivValue, encryptedValue] = value.split('.');
  if (!ivValue || !encryptedValue) return null;

  try {
    const key = await deriveKey(secret);
    const iv = fromBase64Url(ivValue);
    const encrypted = fromBase64Url(encryptedValue);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
      key,
      encrypted.buffer as ArrayBuffer,
    );
    const parsed = JSON.parse(decoder.decode(decrypted)) as Partial<
      OAuthSession
    >;

    if (!parsed.accessToken || !parsed.refreshToken || !parsed.username) {
      return null;
    }

    return parsed as OAuthSession;
  } catch {
    return null;
  }
}
