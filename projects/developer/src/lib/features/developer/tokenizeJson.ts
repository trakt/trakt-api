export type JsonToken = {
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'plain';
  value: string;
};

const MAX_HIGHLIGHTED_TOKENS = 50_000;
const JSON_TOKEN_PATTERN =
  /("(?:\\[\s\S]|[^"\\])*")(?=\s*:)|("(?:\\[\s\S]|[^"\\])*")|(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false)\b|\b(null)\b|((?:[{}\[\],:]|\s+)+)|([\s\S])/g;

export function tokenizeJson(value: string): ReadonlyArray<JsonToken> {
  const tokens: Array<JsonToken> = [];

  for (const match of value.matchAll(JSON_TOKEN_PATTERN)) {
    const type: JsonToken['type'] = match[1]
      ? 'key'
      : match[2]
      ? 'string'
      : match[3]
      ? 'number'
      : match[4]
      ? 'boolean'
      : match[5]
      ? 'null'
      : 'plain';
    const previous = tokens.at(-1);

    if (previous?.type === type) previous.value += match[0];
    else tokens.push({ type, value: match[0] });

    if (tokens.length > MAX_HIGHLIGHTED_TOKENS) {
      return [{ type: 'plain', value }];
    }
  }

  return tokens;
}
