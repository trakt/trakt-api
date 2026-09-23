import type { ApiHeader } from '$lib/api/ApiHeader.ts';
import { FRAGMENT_VERSION } from './FRAGMENT_VERSION.ts';
import { HEADER_PREFIX } from './HEADER_PREFIX.ts';
import { PARAMETER_PREFIX } from './PARAMETER_PREFIX.ts';
import type { RequestEditorTab } from './RequestEditorTab.ts';
import type { RequestUrlState } from './RequestUrlState.ts';
import { safeHeaders } from './safeHeaders.ts';
import { sanitizeBody } from './sanitizeBody.ts';

const REQUEST_EDITOR_TABS: ReadonlySet<string> = new Set<RequestEditorTab>([
  'params',
  'headers',
  'body',
]);

function isRequestEditorTab(value: string): value is RequestEditorTab {
  return REQUEST_EDITOR_TABS.has(value);
}

export function decodeRequestUrlState(
  fragment: string,
): RequestUrlState | null {
  if (!fragment.startsWith('#')) return null;

  const parameters = new URLSearchParams(fragment.slice(1));
  const endpointId = parameters.get('endpoint');
  const serverUrl = parameters.get('server');
  const body = parameters.get('body');
  const activeTab = parameters.get('tab');

  if (parameters.get('v') !== FRAGMENT_VERSION) return null;
  if (endpointId === null || serverUrl === null) return null;
  if (body === null || activeTab === null) return null;
  const mainServerUrl = parameters.get('mainServer') ?? serverUrl;

  const values = Object.fromEntries(
    [...parameters.entries()]
      .filter(([key]) => key.startsWith(PARAMETER_PREFIX))
      .map(([key, value]) => [key.slice(PARAMETER_PREFIX.length), value]),
  );

  const headerIndexes = [
    ...new Set([...parameters.keys()].flatMap((key) => {
      const match = /^header\.(\d+)\./.exec(key);
      const index = Number(match?.at(1));
      return Number.isInteger(index) ? [index] : [];
    })),
  ].sort((left, right) => left - right);
  const headers = headerIndexes.flatMap((index): Array<ApiHeader> => {
    const id = parameters.get(`${HEADER_PREFIX}${index}.id`);
    const name = parameters.get(`${HEADER_PREFIX}${index}.name`);
    const value = parameters.get(`${HEADER_PREFIX}${index}.value`);
    const enabled = parameters.get(`${HEADER_PREFIX}${index}.enabled`);
    if (id === null || name === null || value === null || enabled === null) {
      return [];
    }

    return [{ id, name, value, enabled: enabled === '1' }];
  });

  return {
    endpointId,
    mainServerUrl,
    serverUrl,
    values,
    headers: safeHeaders(headers),
    authorizationEnabled: parameters.get('authorization') !== '0',
    body: sanitizeBody(body),
    activeTab: isRequestEditorTab(activeTab) ? activeTab : null,
  };
}
