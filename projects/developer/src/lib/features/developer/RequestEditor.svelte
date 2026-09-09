<script lang="ts">
  import { operationLink } from "./operationLink.ts";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import { tick } from "svelte";
  import type {
    RequestEditorProps,
    RequestEditorTab,
  } from "./RequestEditorProps.ts";
  import { renderMarkdown } from "$lib/markdown/renderMarkdown.ts";
  import {
    formatCurlRequest,
    formatRequestLine,
  } from "./formatCopiedRequest.ts";
  import { MANAGED_AUTHORIZATION_HEADER_ID } from "$lib/api/headerIds.ts";
  import { dismissOnOutsideInteraction } from "./dismissOnOutsideInteraction.ts";
  import { hasInvalidJsonBody } from "./hasInvalidJsonBody.ts";
  import { invalidParameterIds } from "./invalidParameterIds.ts";
  import { missingRequiredParameterIds } from "./hasMissingRequiredParameters.ts";
  import { tokenizeJson } from "./tokenizeJson.ts";

  const {
    endpoint,
    url,
    serverUrl,
    showServerOverride,
    values,
    headers,
    body,
    activeTab,
    isSending,
    errorMessage,
    onServer,
    onValue,
    onHeader,
    onAddHeader,
    onRemoveHeader,
    onBody,
    onTab,
    onSend,
  }: RequestEditorProps = $props();

  const tabs = $derived<ReadonlyArray<{ id: RequestEditorTab; label: string }>>(
    [
      { id: "params", label: "Parameters" },
      { id: "headers", label: "Headers" },
      { id: "body", label: "Body" },
    ],
  );
  const formattedDescription = $derived(
    renderMarkdown(endpoint.description || endpoint.summary),
  );
  const availableServers = $derived(
    endpoint.serverUrls.length > 0 ? endpoint.serverUrls : [serverUrl],
  );
  const isExpectedJsonBodyMissing = $derived(
    endpoint.requestBody?.contentType.toLocaleLowerCase().includes("json") ===
      true && !body.trim(),
  );
  const bodyJsonTokens = $derived(tokenizeJson(body));
  const isPostJsonBodyInvalid = $derived(
    hasInvalidJsonBody({ endpoint, body }),
  );
  const missingParameterIds = $derived(
    missingRequiredParameterIds({ endpoint, values, headers }),
  );
  const invalidValueParameterIds = $derived(
    invalidParameterIds({ endpoint, values, headers }),
  );
  let requestEditor = $state<HTMLElement>();
  let highlightedBody = $state<HTMLPreElement>();
  let bodyInput = $state<HTMLTextAreaElement>();
  let requestActions = $state<HTMLDivElement>();
  let moreActionsButton = $state<HTMLButtonElement>();
  let isRequestActionsOpen = $state(false);
  let copyFeedback = $state("");
  let copyFeedbackVersion = 0;

  $effect(() => {
    if (!isRequestActionsOpen) return;

    return dismissOnOutsideInteraction({
      container: () => requestActions,
      trigger: () => moreActionsButton,
      onDismiss: () => (isRequestActionsOpen = false),
    });
  });

  async function copyRequest(value: string, confirmation: string) {
    try {
      await navigator.clipboard.writeText(value);
      isRequestActionsOpen = false;
      copyFeedback = confirmation;
    } catch {
      copyFeedback = "Could not copy";
    }

    const feedbackVersion = ++copyFeedbackVersion;
    globalThis.setTimeout(() => {
      if (feedbackVersion === copyFeedbackVersion) copyFeedback = "";
    }, 1_800);
  }

  async function tryRequest() {
    if (isSending) return;

    const parameterId =
      missingParameterIds.at(0) ?? invalidValueParameterIds.at(0);
    if (parameterId) {
      onTab("params");
      await tick();
      const controls = requestEditor?.querySelectorAll<HTMLElement>(
        "[data-parameter-id]",
      );
      [...(controls ?? [])]
        .find((control) => control.dataset.parameterId === parameterId)
        ?.focus();
      return;
    }

    if (isExpectedJsonBodyMissing || isPostJsonBodyInvalid) {
      onTab("body");
      await tick();
      bodyInput?.focus();
      return;
    }

    onSend();
  }

  function syncBodyScroll(event: Event) {
    const textarea = event.currentTarget as HTMLTextAreaElement;
    if (!highlightedBody) return;
    highlightedBody.scrollTop = textarea.scrollTop;
    highlightedBody.scrollLeft = textarea.scrollLeft;
  }
</script>

<section class="trakt-request-editor" bind:this={requestEditor}>
  <header class="endpoint-heading">
    <div class="endpoint-title">
      <div class="endpoint-eyebrow">
        <span>{endpoint.tags.at(0) ?? "API"}</span>
        <span>•</span>
        <code>{endpoint.operationId}</code>
        {#if endpoint.deprecated}<span class="deprecated">Deprecated</span>{/if}
      </div>
      <h1>{endpoint.summary}</h1>
      <div class="markdown endpoint-description">
        {@html formattedDescription}
      </div>
      {#if showServerOverride && availableServers.length > 1}
        <label class="server-selector">
          <span>Request server</span>
          <select
            aria-label="Request server override"
            value={serverUrl}
            onchange={(event) => onServer(event.currentTarget.value)}
          >
            {#each availableServers as server (server)}
              <option value={server}>{server}</option>
            {/each}
          </select>
        </label>
      {/if}
    </div>
    <div class="auth-status">
      {endpoint.auth === "required"
        ? "🔒 OAuth Required"
        : endpoint.auth === "optional"
          ? "🔓 OAuth Optional"
          : "🔑 OAuth Endpoint"}
    </div>
  </header>

  <div class="request-line">
    <span class="method" data-method={endpoint.method}>{endpoint.method}</span>
    <label for="request-url">Request URL</label>
    <input id="request-url" value={url} readonly spellcheck="false" />
    <div class="request-actions" bind:this={requestActions}>
      <button
        type="button"
        class="try-button"
        class:is-sending={isSending}
        aria-label={isSending ? "Sending request" : "Try it"}
        aria-busy={isSending}
        disabled={isSending}
        onclick={tryRequest}
      >
        <span class="try-label" class:is-hidden={isSending}>Try it</span>
        {#if isSending}<span class="try-spinner"><LoadingSpinner /></span>{/if}
      </button>
      <button
        type="button"
        class="more-actions-button"
        bind:this={moreActionsButton}
        aria-label="More request actions"
        aria-haspopup="menu"
        aria-controls="request-actions-menu"
        aria-expanded={isRequestActionsOpen}
        onclick={() => (isRequestActionsOpen = !isRequestActionsOpen)}
      >
        <svg aria-hidden="true" viewBox="0 0 18 4">
          <circle cx="2" cy="2" r="2"></circle>
          <circle cx="9" cy="2" r="2"></circle>
          <circle cx="16" cy="2" r="2"></circle>
        </svg>
      </button>
      {#if isRequestActionsOpen}
        <div id="request-actions-menu" class="request-actions-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            onclick={() =>
              copyRequest(
                new URL(
                  operationLink(endpoint.operationId),
                  globalThis.location.origin,
                ).href,
                "Operation link copied",
              )}>Copy operation link</button
          >
          <button
            type="button"
            role="menuitem"
            onclick={() =>
              copyRequest(
                formatRequestLine({ method: endpoint.method, url }),
                "Request copied",
              )}>Copy method and URL</button
          >
          <button
            type="button"
            role="menuitem"
            onclick={() =>
              copyRequest(
                formatCurlRequest({
                  method: endpoint.method,
                  url,
                  headers,
                  body,
                }),
                "cURL copied",
              )}>Copy as cURL</button
          >
        </div>
      {/if}
      {#if copyFeedback}
        <span class="copy-feedback" role="status">{copyFeedback}</span>
      {/if}
    </div>
  </div>

  {#if errorMessage}
    <div class="request-error" role="alert">{errorMessage}</div>
  {/if}

  <div class="request-tabs" role="tablist" aria-label="Request editor">
    {#each tabs as tab (tab.id)}
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        class:is-selected={activeTab === tab.id}
        onclick={() => onTab(tab.id)}
      >
        {tab.label}
        {#if tab.id === "params" && endpoint.parameters.length > 0}
          <span class="tab-count">{endpoint.parameters.length}</span>
        {:else if tab.id === "headers"}
          <span class="tab-count"
            >{headers.filter((header) => header.enabled).length}</span
          >
        {:else if tab.id === "body" && endpoint.requestBody?.required}
          (required)
        {/if}
      </button>
    {/each}
  </div>

  <div class="tab-content">
    {#if activeTab === "params"}
      <div class="parameter-table">
        <div class="table-header">
          <span>Parameter</span><span>Value</span><span>Description</span>
        </div>
        {#each endpoint.parameters as parameter (parameter.id)}
          <div class="parameter-row">
            <div class="parameter-name">
              <code>{parameter.name}</code>
              <span>{parameter.location}</span>
            </div>
            <div class="parameter-value">
              <div class="parameter-control">
                {#if parameter.type.toLocaleLowerCase() === "boolean"}
                  <select
                    data-parameter-id={parameter.id}
                    aria-label={`${parameter.name} value`}
                    aria-invalid={missingParameterIds.includes(parameter.id) ||
                      invalidValueParameterIds.includes(parameter.id)}
                    value={values[parameter.id] ?? ""}
                    onchange={(event) =>
                      onValue(parameter.id, event.currentTarget.value)}
                  >
                    <option value="">Not set</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                {:else if parameter.enumValues.length > 0}
                  <select
                    data-parameter-id={parameter.id}
                    aria-label={`${parameter.name} value`}
                    aria-invalid={parameter.required &&
                      missingParameterIds.includes(parameter.id)}
                    value={values[parameter.id] ?? ""}
                    onchange={(event) =>
                      onValue(parameter.id, event.currentTarget.value)}
                  >
                    <option value=""
                      >{parameter.required ? "Required" : "Not set"}</option
                    >
                    {#each parameter.enumValues as option (option)}
                      <option value={option}>{option}</option>
                    {/each}
                  </select>
                {:else}
                  <input
                    data-parameter-id={parameter.id}
                    aria-label={`${parameter.name} value`}
                    aria-invalid={missingParameterIds.includes(parameter.id) ||
                      invalidValueParameterIds.includes(parameter.id)}
                    value={values[parameter.id] ?? ""}
                    placeholder={parameter.required ? "Required" : "Not set"}
                    inputmode={parameter.type.toLocaleLowerCase() === "integer"
                      ? "numeric"
                      : undefined}
                    oninput={(event) =>
                      onValue(parameter.id, event.currentTarget.value)}
                  />
                {/if}
              </div>
              {#if invalidValueParameterIds.includes(parameter.id)}
                <span class="parameter-validation"
                  >Enter a valid {parameter.type}.</span
                >
              {/if}
              <div class="parameter-value-meta">
                <code>{parameter.type}</code>
                {#if parameter.required}
                  <em
                    data-state={missingParameterIds.includes(parameter.id)
                      ? "missing"
                      : "filled"}>required</em
                  >
                {/if}
              </div>
            </div>
            <div class="parameter-description">
              <span>{parameter.description || "No description provided."}</span>
            </div>
          </div>
        {:else}
          <div class="empty-tab">
            <strong>No documented parameters</strong>
            <span
              >The request URL is generated from the documented server and path.</span
            >
          </div>
        {/each}
      </div>
    {:else if activeTab === "headers"}
      <div class="header-editor">
        {#each headers as header (header.id)}
          <div class="header-row" class:is-managed={header.managed === true}>
            <input
              type="checkbox"
              aria-label={`Enable ${header.name || "header"}`}
              checked={header.enabled}
              disabled={header.managed &&
                (header.id !== MANAGED_AUTHORIZATION_HEADER_ID ||
                  header.value === "Not attached")}
              onchange={(event) =>
                onHeader(header.id, "enabled", event.currentTarget.checked)}
            />
            <input
              aria-label="Header name"
              value={header.name}
              placeholder="Header name"
              disabled={header.managed}
              oninput={(event) =>
                onHeader(header.id, "name", event.currentTarget.value)}
            />
            <input
              aria-label={`${header.name || "Header"} value`}
              value={header.value}
              placeholder="Value"
              disabled={header.managed}
              oninput={(event) =>
                onHeader(header.id, "value", event.currentTarget.value)}
            />
            {#if header.managed}
              <span class="managed-badge">managed</span>
            {:else}
              <button
                type="button"
                aria-label={`Remove ${header.name || "header"}`}
                onclick={() => onRemoveHeader(header.id)}>×</button
              >
            {/if}
          </div>
        {/each}
        <button type="button" class="add-header" onclick={onAddHeader}
          >＋ Add header</button
        >
      </div>
    {:else if activeTab === "body"}
      <div class="body-editor">
        <div class="editor-toolbar">
          <span>{endpoint.requestBody?.contentType ?? "application/json"}</span>
          <div class="editor-toolbar-actions">
            {#if endpoint.requestBody?.example.trim()}
              <button
                type="button"
                class="sample-body-button"
                onclick={() => onBody(endpoint.requestBody?.example ?? "")}
                >Use sample body</button
              >
            {/if}
            <span>{body.length.toLocaleString()} characters</span>
          </div>
        </div>
        <label for="request-body">Request body</label>
        <div class="body-editor-surface">
          <pre
            class="body-highlight"
            bind:this={highlightedBody}
            aria-hidden="true">{#each bodyJsonTokens as token}{#if token.type === "plain"}{token.value}{:else}<span
                  data-json-token={token.type}>{token.value}</span
                >{/if}{/each}</pre>
          <textarea
            id="request-body"
            bind:this={bodyInput}
            value={body}
            spellcheck="false"
            placeholder={endpoint.requestBody
              ? "Enter request body"
              : "This endpoint has no documented body."}
            aria-invalid={isPostJsonBodyInvalid}
            aria-describedby={isPostJsonBodyInvalid
              ? "request-body-validation"
              : undefined}
            oninput={(event) => onBody(event.currentTarget.value)}
            onscroll={syncBodyScroll}></textarea>
        </div>
        {#if isPostJsonBodyInvalid}
          <p id="request-body-validation" class="body-validation" role="alert">
            Invalid JSON. Fix the syntax before sending this request.
          </p>
        {/if}
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  .trakt-request-editor {
    overflow: auto;
    min-width: 0;
    min-height: 0;

    background: var(--color-canvas);

    .endpoint-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--ni-24);

      padding: var(--ni-24) 26px var(--ni-20);
    }

    .endpoint-title {
      min-width: 0;
    }

    .endpoint-eyebrow {
      display: flex;
      align-items: center;
      gap: 7px;

      color: var(--color-muted);
      font-size: var(--ni-11);
    }

    .endpoint-eyebrow code {
      font: var(--ni-11) var(--font-mono);
    }

    .deprecated {
      padding: var(--ni-2) var(--ni-8);
      border-radius: 999px;

      background: var(--color-accent-soft);
      color: var(--color-delete);
    }

    .endpoint-title h1 {
      margin: 8px 0 7px;
      font-size: clamp(var(--ni-22), 2vw, var(--ni-30));
      letter-spacing: -0.025em;
    }

    .endpoint-description {
      max-width: 760px;

      color: var(--color-muted);
      font-size: 13px;
      line-height: 1.55;
    }

    .server-selector {
      position: relative;

      display: grid;
      width: fit-content;
      gap: var(--ni-8);
      margin-block-start: var(--ni-18);
    }

    .server-selector::after {
      position: absolute;
      inset-block-end: 15px;
      inset-inline-end: var(--ni-10);

      width: 7px;
      height: var(--ni-4);

      background: var(--color-muted);
      clip-path: polygon(0 0, 100% 0, 50% 100%);

      content: "";
      pointer-events: none;
    }

    .server-selector > span {
      color: var(--color-subtle);
      font-size: 9px;
      font-weight: 650;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .server-selector select {
      height: 35px;
      max-width: 360px;
      padding-inline: 9px var(--ni-28);

      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-control);

      background-color: var(--color-surface);
      font: var(--ni-10) var(--font-mono);
    }

    .auth-status {
      flex: 0 0 auto;

      padding: 7px 9px;
      border: var(--ni-1) solid var(--color-border);
      border-radius: 999px;

      color: var(--color-muted);
      font-size: var(--ni-11);
    }

    .request-line {
      display: grid;
      grid-template-columns: var(--ni-72) minmax(0, 1fr) auto;
      gap: 0;

      margin: 0 26px;
      border: var(--ni-1) solid var(--color-border-strong);
      border-radius: 999px;

      background: var(--color-surface);
    }

    .request-line > label {
      position: absolute;

      width: var(--ni-1);
      height: var(--ni-1);

      overflow: hidden;
      clip: rect(0 0 0 0);
    }

    .request-line .method {
      display: grid;
      place-items: center;

      border-inline-end: var(--ni-1) solid var(--color-border);
      font: 750 var(--ni-12) var(--font-mono);
    }

    .method[data-method="GET"] {
      color: var(--color-get);
    }

    .method[data-method="POST"] {
      color: var(--color-post);
    }

    .method[data-method="PUT"] {
      color: var(--color-put);
    }

    .method[data-method="PATCH"] {
      color: var(--color-patch);
    }

    .method[data-method="DELETE"] {
      color: var(--color-delete);
    }

    .request-line input {
      min-width: 0;
      padding: var(--ni-12) 13px;

      border: 0;
      outline: 0;

      background: transparent;
      font: var(--ni-12) var(--font-mono);
    }

    .request-line input[readonly] {
      cursor: default;
      color: var(--color-code);
    }

    .request-actions {
      position: relative;

      display: flex;
      align-items: stretch;
      gap: var(--ni-2);

      margin: var(--ni-4);
      background: transparent;
    }

    .try-button,
    .more-actions-button {
      display: grid;
      min-height: 35px;
      place-items: center;

      border: 0;
      background: var(--color-surface-hover);
      color: var(--color-foreground);

      font-size: var(--ni-12);
      font-weight: 700;
      line-height: 1;
    }

    .try-label.is-hidden {
      visibility: hidden;
    }

    .try-spinner {
      position: absolute;
      inset: 0;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .try-button {
      position: relative;

      padding-inline: 15px;
      border-start-start-radius: 999px;
      border-end-start-radius: 999px;
    }

    .more-actions-button {
      width: var(--ni-36);
      padding: 0;

      border-start-end-radius: 999px;
      border-end-end-radius: 999px;
    }

    .more-actions-button > svg {
      display: block;
      width: var(--ni-18);
      height: var(--ni-4);

      fill: currentColor;
    }

    .try-button:hover,
    .more-actions-button:hover,
    .more-actions-button[aria-expanded="true"] {
      background: var(--color-border-strong);
    }

    .try-button:disabled {
      cursor: not-allowed;
      color: var(--color-subtle);
    }

    .try-button.is-sending:disabled {
      cursor: wait;
    }

    .request-actions-menu {
      position: absolute;
      z-index: 30;
      inset-block-start: calc(100% + var(--ni-8));
      inset-inline-end: 0;

      display: grid;
      width: 184px;

      padding: var(--ni-6);
      border: var(--ni-1) solid var(--color-border-strong);
      border-radius: var(--radius-medium);

      background: var(--color-surface-raised);
      box-shadow: var(--shadow-popover);
    }

    .request-actions-menu > button {
      padding: 8px 9px;
      border: 0;
      border-radius: var(--radius-small);

      background: transparent;
      color: var(--color-muted);

      font-size: var(--ni-11);
      text-align: start;
    }

    .request-actions-menu > button:hover,
    .request-actions-menu > button:focus-visible {
      background: var(--color-surface-hover);
      color: var(--color-foreground);
    }

    .copy-feedback {
      position: absolute;
      z-index: 20;
      inset-block-start: calc(100% + 7px);
      inset-inline-end: 0;

      padding: var(--ni-6) 8px;
      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-small);

      background: var(--color-surface-raised);
      box-shadow: var(--shadow-popover);

      color: var(--color-muted);
      font-size: var(--ni-10);
      white-space: nowrap;
    }

    .request-error {
      margin: var(--ni-10) 26px 0;
      padding: 9px var(--ni-11);
      border: var(--ni-1) solid
        color-mix(in srgb, var(--color-delete) 40%, transparent);
      border-radius: var(--radius-medium);

      background: color-mix(in srgb, var(--color-delete) 8%, transparent);
      color: var(--color-delete);

      font-size: var(--ni-12);
    }

    .request-tabs {
      display: flex;
      gap: var(--ni-3);

      margin-block-start: var(--ni-22);
      padding-inline: 26px;

      overflow-x: auto;
    }

    .request-tabs button {
      display: inline-flex;
      align-items: center;
      flex: 0 0 auto;
      gap: var(--ni-6);

      padding: var(--ni-6) 8px;
      border: 0;
      border-radius: var(--radius-small);

      background: transparent;
      color: var(--color-muted);

      font-size: var(--ni-11);
    }

    .request-tabs button.is-selected {
      background: var(--color-surface-hover);
      color: var(--color-foreground);
    }

    .request-tabs .tab-count {
      min-width: 17px;
      padding: var(--ni-1) var(--ni-4);
      border-radius: var(--ni-3);

      background: var(--color-surface-raised);
      color: var(--color-subtle);

      font: 9px var(--font-mono);
      text-align: center;
    }

    .tab-content {
      padding: var(--ni-18) 26px var(--ni-28);
    }

    .parameter-table {
      overflow: hidden;
      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-medium);
    }

    .table-header,
    .parameter-row {
      display: grid;
      grid-template-columns: minmax(150px, 0.8fr) minmax(150px, 1fr) minmax(
          200px,
          1.2fr
        );
      gap: var(--ni-12);

      padding: var(--ni-10) var(--ni-12);
    }

    .table-header {
      align-items: center;

      background: var(--color-surface-raised);
      color: var(--color-subtle);

      font-size: var(--ni-10);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .parameter-row {
      align-items: start;
      border-block-start: var(--ni-1) solid var(--color-border);
      font-size: var(--ni-12);
    }

    .parameter-name {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ni-6);

      padding-block-start: 9px;
    }

    .parameter-name code {
      font: var(--ni-12) var(--font-mono);
    }

    .parameter-name span,
    .parameter-value-meta code,
    .parameter-value-meta em {
      padding: var(--ni-2) var(--ni-6);
      border-radius: var(--ni-4);

      background: var(--color-surface-hover);
      color: var(--color-subtle);

      font: 9px var(--font-mono);
      font-style: normal;
    }

    .parameter-value-meta em[data-state="filled"] {
      color: var(--color-warning);
    }

    .parameter-value-meta em[data-state="missing"] {
      color: var(--color-delete);
    }

    .parameter-validation {
      color: var(--color-delete);
      font-size: var(--ni-10);
    }

    .parameter-control input,
    .parameter-control select {
      width: 100%;
      height: 35px;
      padding-inline: 9px;

      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-control);

      background: var(--color-surface);
      font: var(--ni-11) var(--font-mono);
    }

    .parameter-value {
      display: grid;
      gap: var(--ni-8);
    }

    .parameter-control {
      position: relative;
    }

    .parameter-control select {
      padding-inline-end: var(--ni-28);
    }

    .parameter-control:has(> select)::after {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-end: var(--ni-10);

      width: 7px;
      height: var(--ni-4);

      background: var(--color-muted);
      clip-path: polygon(0 0, 100% 0, 50% 100%);

      content: "";
      pointer-events: none;
      transform: translateY(-50%);
    }

    .parameter-value-meta {
      display: flex;
      align-items: center;
      gap: var(--ni-6);
    }

    .parameter-description {
      display: flex;
      align-items: center;
      gap: 8px;

      padding-block-start: 9px;

      color: var(--color-muted);
      line-height: 1.4;
    }

    .header-editor {
      display: grid;
      gap: 8px;
    }

    .header-row {
      display: grid;
      grid-template-columns:
        var(--ni-22) minmax(130px, 0.7fr) minmax(180px, 1fr)
        var(--ni-72);
      align-items: center;
      gap: 8px;
    }

    .header-row input:not([type="checkbox"]) {
      min-width: 0;
      min-height: 35px;
      padding-inline: 9px;

      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-control);

      background: var(--color-surface);
      font: var(--ni-11) var(--font-mono);
    }

    .header-row.is-managed input {
      color: var(--color-subtle);
      opacity: 1;
    }

    .managed-badge {
      color: var(--color-info);
      font-size: 9px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .header-row > button,
    .add-header {
      border: 0;
      background: transparent;
      color: var(--color-muted);
    }

    .header-row > button {
      width: var(--ni-32);
      height: var(--ni-32);

      border-radius: var(--radius-small);
      font-size: var(--ni-18);
    }

    .header-row > button:hover {
      background: var(--color-surface-hover);
      color: var(--color-delete);
    }

    .add-header {
      justify-self: start;
      padding: 8px 0;

      color: var(--color-info);
      font-size: var(--ni-11);
    }

    .body-editor {
      overflow: hidden;

      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-control);

      background: var(--color-surface);
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 8px var(--ni-11);
      border-block-end: var(--ni-1) solid var(--color-border);

      color: var(--color-subtle);
      font: var(--ni-10) var(--font-mono);
    }

    .editor-toolbar-actions {
      display: flex;
      align-items: center;
      gap: var(--ni-10);
    }

    .sample-body-button {
      padding: var(--ni-3) var(--ni-8);
      border: 0;
      border-radius: var(--radius-small);

      background: var(--color-surface-hover);
      color: var(--color-info);

      font: inherit;
    }

    .sample-body-button:hover {
      color: var(--color-foreground);
    }

    .body-editor label {
      position: absolute;

      width: var(--ni-1);
      height: var(--ni-1);

      overflow: hidden;
      clip: rect(0 0 0 0);
    }

    .body-editor-surface {
      position: relative;
      min-height: 300px;
    }

    .body-editor textarea,
    .body-highlight {
      display: block;
      width: 100%;
      min-height: 300px;
      margin: 0;
      padding: var(--ni-14);

      border: 0;

      font: var(--ni-12)/1.6 var(--font-mono);
      tab-size: 2;
      white-space: pre-wrap;
      overflow-wrap: break-word;
    }

    .body-highlight {
      position: absolute;
      inset: 0;

      overflow: auto;
      height: 100%;

      color: var(--color-muted);

      pointer-events: none;
      scrollbar-width: none;
    }

    .body-highlight::-webkit-scrollbar {
      display: none;
    }

    .body-highlight [data-json-token="key"] {
      color: var(--purple-400);
    }

    .body-highlight [data-json-token="string"] {
      color: var(--color-get);
    }

    .body-highlight [data-json-token="number"] {
      color: var(--yellow-400);
    }

    .body-highlight [data-json-token="boolean"] {
      color: var(--color-post);
    }

    .body-highlight [data-json-token="null"] {
      color: var(--color-delete);
    }

    .body-editor textarea {
      position: relative;

      resize: vertical;
      outline: 0;

      background: transparent;
      color: transparent;
      caret-color: var(--color-code);
      -webkit-text-fill-color: transparent;
    }

    .body-editor textarea::placeholder {
      color: var(--color-subtle);
      -webkit-text-fill-color: var(--color-subtle);
    }

    .body-validation {
      margin: 0;
      padding: 8px var(--ni-11);
      border-block-start: var(--ni-1) solid
        color-mix(in srgb, var(--color-delete) 35%, transparent);

      color: var(--color-delete);
      font-size: var(--ni-11);
    }

    .markdown :global(:first-child) {
      margin-block-start: 0;
    }

    .markdown :global(:last-child) {
      margin-block-end: 0;
    }

    .markdown :global(p),
    .markdown :global(ul),
    .markdown :global(ol),
    .markdown :global(blockquote),
    .markdown :global(pre),
    .markdown :global(table) {
      margin: 0 0 var(--ni-14);
    }

    .markdown :global(h1),
    .markdown :global(h2),
    .markdown :global(h3),
    .markdown :global(h4),
    .markdown :global(h5),
    .markdown :global(h6) {
      margin: var(--ni-20) 0 8px;

      color: var(--color-foreground);
      font-size: 13px;
      line-height: 1.35;
    }

    .markdown :global(ul),
    .markdown :global(ol) {
      padding-inline-start: var(--ni-22);
    }

    .markdown :global(li) {
      margin-block: var(--ni-4);
    }

    .markdown :global(a) {
      color: var(--color-info);
      text-underline-offset: var(--ni-2);
    }

    .markdown :global(code) {
      padding: var(--ni-2) var(--ni-4);
      border-radius: var(--ni-4);

      background: var(--color-surface-hover);
      color: var(--color-code);

      font: var(--ni-11) var(--font-mono);
    }

    .markdown :global(pre) {
      overflow-x: auto;

      padding: var(--ni-12);
      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-small);

      background: var(--color-surface);
    }

    .markdown :global(pre code) {
      padding: 0;
      background: transparent;
    }

    .markdown :global(blockquote) {
      padding-inline-start: var(--ni-12);
      border-inline-start: var(--ni-2) solid var(--color-info);
      color: var(--color-subtle);
    }

    .markdown :global(table) {
      display: block;
      overflow-x: auto;

      width: 100%;
      border-collapse: collapse;
    }

    .markdown :global(th),
    .markdown :global(td) {
      padding: 7px 9px;
      border: var(--ni-1) solid var(--color-border);

      text-align: start;
      vertical-align: top;
    }

    .markdown :global(th) {
      background: var(--color-surface-raised);
      color: var(--color-foreground);
      font-size: var(--ni-11);
    }

    .empty-tab {
      display: grid;
      gap: var(--ni-6);

      padding: var(--ni-28);

      color: var(--color-muted);
      text-align: center;
    }
  }
</style>
