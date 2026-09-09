<script lang="ts">
  import type { ResponseInspectorProps } from "./ResponseInspectorProps.ts";
  import { getHttpStatusMeaning } from "./getHttpStatusMeaning.ts";
  import { tokenizeJson } from "./tokenizeJson.ts";

  type DetailTab = "body" | "headers";
  type ExpectedBodyMode = "all" | "required";

  const {
    endpoint,
    history,
    isSending,
    onDeleteResponse,
  }: ResponseInspectorProps = $props();
  let selectedKey = $state("");
  let activeTab = $state<DetailTab>("body");
  let expectedBodyMode = $state<ExpectedBodyMode>("required");
  let latestSeenId = $state("");
  let didCopy = $state(false);

  const endpointHistory = $derived(
    history.filter((entry) => entry.endpointId === endpoint.id),
  );
  const selectedExpected = $derived(
    selectedKey.startsWith("expected:")
      ? endpoint.responses.find(
          (response) => `expected:${response.status}` === selectedKey,
        )
      : undefined,
  );
  const selectedLive = $derived(
    selectedKey.startsWith("live:")
      ? endpointHistory.find((entry) => `live:${entry.id}` === selectedKey)
      : undefined,
  );
  const selectedBody = $derived.by(() => {
    if (selectedLive) return selectedLive.response.body;
    if (!selectedExpected) return "";
    return expectedBodyMode === "required"
      ? selectedExpected.requiredExample
      : selectedExpected.example;
  });
  const selectedHeaders = $derived.by(() => {
    if (selectedLive) return selectedLive.response.headers;
    if (!selectedExpected) return [];
    return [
      ...(selectedExpected.contentType
        ? [{ name: "content-type", value: selectedExpected.contentType }]
        : []),
      ...(selectedExpected.headers ?? []).map((header) => ({
        name: header.name,
        value: header.example || header.description || "Documented",
      })),
    ];
  });
  const selectedIsJson = $derived(
    selectedLive?.response.isJson ??
      selectedExpected?.contentType.includes("json") ??
      false,
  );
  const selectedJsonTokens = $derived(
    selectedIsJson ? tokenizeJson(selectedBody) : [],
  );
  const selectedStatus = $derived(
    selectedLive
      ? `${selectedLive.response.status} ${selectedLive.response.statusText}`.trim()
      : selectedExpected
        ? [
            selectedExpected.status,
            getHttpStatusMeaning(selectedExpected.status),
          ]
            .filter(Boolean)
            .join(" ")
        : "",
  );
  $effect(() => {
    const latest = endpointHistory.at(-1);
    if (latest && latest.id !== latestSeenId) {
      latestSeenId = latest.id;
      selectedKey = `live:${latest.id}`;
      activeTab = "body";
      didCopy = false;
      return;
    }

    if (selectedExpected || selectedLive) return;
    selectedKey = endpoint.responses.at(0)
      ? `expected:${endpoint.responses[0].status}`
      : latest
        ? `live:${latest.id}`
        : "";
    expectedBodyMode = "required";
  });

  function selectResponse(key: string) {
    selectedKey = key;
    activeTab = "body";
    expectedBodyMode = "required";
    didCopy = false;
  }

  function selectExpectedBodyMode(mode: ExpectedBodyMode) {
    expectedBodyMode = mode;
    didCopy = false;
  }

  function deleteResponse(id: string) {
    const deletedKey = `live:${id}`;
    const deletedIndex = endpointHistory.findIndex((entry) => entry.id === id);
    const remaining = endpointHistory.filter((entry) => entry.id !== id);
    latestSeenId = remaining.at(-1)?.id ?? "";

    if (selectedKey === deletedKey) {
      const fallback = remaining[deletedIndex] ?? remaining[deletedIndex - 1];
      selectedKey = fallback
        ? `live:${fallback.id}`
        : endpoint.responses.at(0)
          ? `expected:${endpoint.responses[0].status}`
          : "";
      activeTab = "body";
      didCopy = false;
    }

    onDeleteResponse(id);
  }

  async function copyBody() {
    if (!selectedBody) return;
    await navigator.clipboard.writeText(selectedBody);
    didCopy = true;
    globalThis.setTimeout(() => (didCopy = false), 1200);
  }

  function formattedReceivedAt(value: string): string {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(new Date(value));
  }
</script>

<section class="trakt-response-inspector" aria-label="Response inspector">
  <header class="response-header">
    <div class="response-picker" role="tablist" aria-label="Responses">
      {#each endpoint.responses as expectedResponse (expectedResponse.status)}
        {@const key = `expected:${expectedResponse.status}`}
        <button
          type="button"
          role="tab"
          aria-selected={selectedKey === key}
          class:is-selected={selectedKey === key}
          onclick={() => selectResponse(key)}
          title={`${expectedResponse.status} ${getHttpStatusMeaning(expectedResponse.status)}`}
        >
          Expected
          <span class="tab-count">{expectedResponse.status}</span>
        </button>
      {/each}
      {#each endpointHistory as entry (entry.id)}
        {@const key = `live:${entry.id}`}
        <div
          class="live-response-tab"
          class:is-selected={selectedKey === key}
          role="presentation"
        >
          <button
            type="button"
            class="response-select-button"
            role="tab"
            aria-selected={selectedKey === key}
            onclick={() => selectResponse(key)}
            title={`${entry.response.status} ${entry.response.statusText}`}
            >Response #{entry.sequence}</button
          >
          <button
            type="button"
            class="delete-response-button"
            aria-label={`Delete response ${entry.sequence}`}
            title="Delete response"
            onclick={() => deleteResponse(entry.id)}
          >
            <svg aria-hidden="true" viewBox="0 0 12 12">
              <path d="M2.5 2.5 9.5 9.5M9.5 2.5 2.5 9.5" />
            </svg>
          </button>
        </div>
      {/each}
    </div>

    <section
      class="response-summary"
      aria-label="Request and response information"
    >
      {#if isSending}
        <p class="sending-status">Waiting for Trakt…</p>
      {/if}
      {#if selectedLive}
        <dl class="response-info">
          <div>
            <dt>Request</dt>
            <dd>
              <code data-method={selectedLive.request.method}
                >{selectedLive.request.method}</code
              >
              {selectedLive.request.url}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{selectedStatus}</dd>
          </div>
          <div>
            <dt>Received</dt>
            <dd>{formattedReceivedAt(selectedLive.receivedAt)}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{selectedLive.response.durationMs} ms</dd>
          </div>
          <div>
            <dt>Response size</dt>
            <dd>{selectedLive.response.size.toLocaleString()} bytes</dd>
          </div>
          <div>
            <dt>Format</dt>
            <dd>{selectedLive.response.isJson ? "JSON" : "Text"}</dd>
          </div>
        </dl>
      {:else if selectedExpected}
        <dl class="response-info">
          <div>
            <dt>Request</dt>
            <dd>
              <code data-method={endpoint.method}>{endpoint.method}</code>
              {endpoint.path}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{selectedStatus}</dd>
          </div>
        </dl>
      {:else}
        <p class="summary-empty">
          Choose a documented response or send a request.
        </p>
      {/if}
    </section>

    <div class="response-actions">
      <div role="tablist" aria-label="Response details">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "body"}
          class:is-selected={activeTab === "body"}
          onclick={() => (activeTab = "body")}>Body</button
        >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "headers"}
          class:is-selected={activeTab === "headers"}
          onclick={() => (activeTab = "headers")}
        >
          Headers
          {#if selectedHeaders.length > 0}
            <span class="tab-count">{selectedHeaders.length}</span>
          {/if}
        </button>
      </div>
    </div>
  </header>

  <div class="response-content">
    {#if !selectedExpected && !selectedLive}
      <div class="empty-response">
        <span aria-hidden="true">↗</span>
        <strong>No response selected</strong>
        <p>
          Choose a documented response or send a request to inspect its result.
        </p>
      </div>
    {:else if activeTab === "body"}
      {#if selectedExpected}
        <div class="response-body-toolbar">
          <div
            class="response-body-modes"
            role="group"
            aria-label="Expected response fields"
          >
            <button
              type="button"
              class:is-selected={expectedBodyMode === "required"}
              aria-pressed={expectedBodyMode === "required"}
              onclick={() => selectExpectedBodyMode("required")}
              >Min data</button
            >
            <button
              type="button"
              class:is-selected={expectedBodyMode === "all"}
              aria-pressed={expectedBodyMode === "all"}
              onclick={() => selectExpectedBodyMode("all")}>All data</button
            >
          </div>
          {#if selectedBody}
            <button type="button" class="copy-button" onclick={copyBody}>
              {didCopy ? "Copied" : "Copy"}
            </button>
          {/if}
        </div>
      {:else if selectedLive && selectedBody}
        <div class="response-body-toolbar is-live">
          <button type="button" class="copy-button" onclick={copyBody}>
            {didCopy ? "Copied" : "Copy"}
          </button>
        </div>
      {/if}
      {#if selectedBody}
        {#if selectedIsJson}
          <pre
            class="is-json">{#each selectedJsonTokens as token}{#if token.type === "plain"}{token.value}{:else}<span
                  data-json-token={token.type}>{token.value}</span
                >{/if}{/each}</pre>
        {:else}
          <pre>{selectedBody}</pre>
        {/if}
      {:else}
        <div class="empty-response compact">
          <strong>No response body</strong>
          <p>
            {selectedExpected
              ? "The OpenAPI specification only defines this status response."
              : "Trakt returned an empty response body."}
          </p>
        </div>
      {/if}
    {:else if activeTab === "headers"}
      <div class="response-headers">
        {#each selectedHeaders as header, index (`${index}:${header.name}:${header.value}`)}
          <div><code>{header.name}</code><span>{header.value}</span></div>
        {:else}
          <p>
            {selectedExpected
              ? "No response headers are documented."
              : "No response headers were exposed."}
          </p>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  .trakt-response-inspector {
    display: grid;
    min-width: 0;
    min-height: 0;
    grid-template-rows: auto minmax(0, 1fr);

    background: var(--color-surface);

    .response-header {
      display: grid;
      gap: var(--ni-12);

      padding: var(--ni-14) var(--ni-16) var(--ni-10);
      border-block-end: var(--ni-1) solid var(--color-border);
    }

    .response-actions,
    .response-actions > div,
    .response-picker {
      display: flex;
      align-items: center;
    }

    .response-picker {
      min-width: 0;
      overflow-x: auto;
      gap: var(--ni-4);
      scrollbar-width: thin;
    }

    .response-picker > button,
    .live-response-tab,
    .response-actions button {
      display: inline-flex;
      align-items: center;
      flex: 0 0 auto;
      gap: var(--ni-6);

      padding: var(--ni-6) 8px;
      border: var(--ni-1) solid transparent;
      border-radius: var(--radius-small);

      background: transparent;
      color: var(--color-muted);

      font-size: var(--ni-11);
      white-space: nowrap;
    }

    .response-picker > button:hover,
    .live-response-tab:hover,
    .response-actions button:hover {
      background: var(--color-surface-raised);
      color: var(--color-foreground);
    }

    .response-picker > button.is-selected,
    .live-response-tab.is-selected {
      border-color: var(--color-border-strong);
      background: var(--color-surface-hover);
      color: var(--color-foreground);
    }

    .response-picker > button,
    .live-response-tab {
      height: var(--ni-30);
    }

    .live-response-tab {
      gap: 0;
      padding: 0;
    }

    .response-select-button,
    .delete-response-button {
      align-self: stretch;
      border: 0;

      background: transparent;
      color: inherit;
    }

    .response-select-button {
      padding-block: var(--ni-6);
      padding-inline: 8px var(--ni-4);

      border-start-start-radius: var(--radius-small);
      border-end-start-radius: var(--radius-small);

      font-size: var(--ni-11);
      white-space: nowrap;
    }

    .delete-response-button {
      align-self: center;
      display: grid;
      width: var(--ni-20);
      height: var(--ni-20);
      flex: 0 0 var(--ni-20);
      place-items: center;

      margin-block: var(--ni-3);
      margin-inline: var(--ni-2) var(--ni-4);
      padding: 0;

      border-radius: 50%;
      color: var(--color-subtle);
    }

    .delete-response-button svg {
      display: block;
      width: var(--ni-10);
      height: var(--ni-10);

      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-width: 1.7;
    }

    .delete-response-button:hover {
      background: color-mix(in srgb, var(--color-delete) 12%, transparent);
      color: var(--color-delete);
    }

    .response-actions {
      justify-content: flex-start;
      gap: var(--ni-10);

      padding-block-start: 9px;
      border-block-start: var(--ni-1) solid var(--color-border);
    }

    .response-actions > div {
      gap: var(--ni-3);
    }

    .response-actions button {
      border: 0;
    }

    .response-actions button.is-selected {
      background: var(--color-surface-hover);
      color: var(--color-foreground);
    }

    .tab-count {
      min-width: 17px;
      padding: var(--ni-1) var(--ni-4);
      border-radius: var(--ni-3);

      background: var(--color-surface-raised);
      color: var(--color-subtle);

      font: 9px var(--font-mono);
      text-align: center;
    }

    .response-summary {
      max-height: 250px;
      overflow: auto;

      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-medium);

      background: var(--color-surface-raised);
    }

    .sending-status,
    .summary-empty {
      margin: 0;
      padding: var(--ni-10) var(--ni-12);

      color: var(--color-info);
      font-size: var(--ni-10);
    }

    .summary-empty {
      color: var(--color-muted);
    }

    .response-content {
      overflow: auto;
      min-width: 0;
      min-height: 0;
    }

    .response-body-toolbar {
      position: sticky;
      z-index: 2;
      inset-block-start: 0;

      display: flex;
      align-items: center;
      justify-content: space-between;

      min-height: 39px;
      padding: var(--ni-8) var(--ni-12);
      border-block-end: var(--ni-1) solid var(--color-border);

      background: var(--color-surface-raised);
    }

    .response-body-toolbar.is-live {
      justify-content: flex-end;
    }

    .response-body-modes {
      display: flex;
      gap: var(--ni-3);
    }

    .response-body-toolbar button {
      padding: var(--ni-6) 8px;
      border: 0;
      border-radius: var(--radius-small);

      background: transparent;
      color: var(--color-muted);

      font-size: var(--ni-11);
    }

    .response-body-toolbar button:hover,
    .response-body-toolbar button.is-selected {
      background: var(--color-surface-hover);
      color: var(--color-foreground);
    }

    .response-body-toolbar .copy-button {
      border: var(--ni-1) solid var(--color-border);
    }

    pre {
      min-width: max-content;
      margin: 0;
      padding: var(--ni-16);

      color: var(--color-code);

      font: var(--ni-11)/1.65 var(--font-mono);
      tab-size: 2;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    pre.is-json {
      color: var(--color-muted);
    }

    pre [data-json-token="key"] {
      color: var(--purple-400);
    }

    pre [data-json-token="string"] {
      color: var(--color-get);
    }

    pre [data-json-token="number"] {
      color: var(--yellow-400);
    }

    pre [data-json-token="boolean"] {
      color: var(--color-post);
    }

    pre [data-json-token="null"] {
      color: var(--color-delete);
    }

    .response-headers {
      display: grid;
      padding: var(--ni-10);
    }

    .response-headers div {
      display: grid;
      grid-template-columns: minmax(120px, 0.7fr) minmax(160px, 1fr);
      gap: var(--ni-10);

      padding: 8px;
      border-block-end: var(--ni-1) solid var(--color-border);

      font-size: var(--ni-11);
    }

    .response-headers code {
      color: var(--color-info);
      font: var(--ni-10) var(--font-mono);
    }

    .response-headers span {
      overflow-wrap: anywhere;
      color: var(--color-muted);
      font: var(--ni-10)/1.5 var(--font-mono);
    }

    .response-headers > p {
      color: var(--color-muted);
      font-size: var(--ni-11);
      text-align: center;
    }

    .response-info {
      display: grid;
      margin: 0;
      padding: var(--ni-8) var(--ni-12);
    }

    .response-info > div {
      display: grid;
      grid-template-columns: 100px minmax(0, 1fr);
      align-items: baseline;
      gap: var(--ni-12);

      padding-block: 7px;
      border-block-end: var(--ni-1) solid var(--color-border);
    }

    .response-info > div:last-child {
      border-block-end: 0;
    }

    .response-info dt {
      color: var(--color-subtle);
      font-size: var(--ni-10);
      text-transform: uppercase;
    }

    .response-info dd {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;

      color: var(--color-muted);
      font: var(--ni-10)/1.5 var(--font-mono);
    }

    .response-info code {
      color: var(--color-muted);
      font: inherit;
    }

    .response-info code[data-method="GET"] {
      color: var(--color-get);
    }

    .response-info code[data-method="POST"] {
      color: var(--color-post);
    }

    .response-info code[data-method="PUT"] {
      color: var(--color-put);
    }

    .response-info code[data-method="PATCH"] {
      color: var(--color-patch);
    }

    .response-info code[data-method="DELETE"] {
      color: var(--color-delete);
    }

    .empty-response {
      display: grid;
      min-height: 100%;
      place-content: center;
      justify-items: center;
      gap: 7px;
      padding: var(--ni-30);

      color: var(--color-muted);
      text-align: center;
    }

    .empty-response.compact {
      min-height: 260px;
    }

    .empty-response > span {
      display: grid;
      width: var(--ni-38);
      height: var(--ni-38);
      place-items: center;

      margin-block-end: var(--ni-4);
      border: var(--ni-1) solid var(--color-border-strong);
      border-radius: 50%;

      color: var(--color-info);
      font: var(--ni-14) var(--font-mono);
    }

    .empty-response strong {
      color: var(--color-foreground);
      font-size: 13px;
    }

    .empty-response p {
      max-width: 290px;
      margin: 0;

      font-size: var(--ni-11);
      line-height: 1.5;
    }
  }
</style>
