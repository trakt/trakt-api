<script lang="ts">
  import {
    MANAGED_AUTHORIZATION_HEADER_ID,
    parameterHeaderId,
  } from "$lib/api/headerIds.ts";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import GuideReader from "./GuideReader.svelte";
  import type { ApiHeader } from "$lib/api/ApiHeader.ts";
  import { executeApiRequest } from "$lib/api/executeApiRequest.ts";
  import { fetchAccounts } from "$lib/api/fetchAccounts.ts";
  import type { DeveloperAccount } from "$lib/api/DeveloperAccount.ts";
  import type { Endpoint } from "$lib/openapi/Endpoint.ts";
  import { buildEndpointUrl } from "$lib/openapi/buildEndpointUrl.ts";
  import { filterEndpoints } from "$lib/openapi/filterEndpoints.ts";
  import type { OpenApiCatalog } from "$lib/openapi/OpenApiCatalog.ts";
  import { parseOpenApiDocument } from "$lib/openapi/parseOpenApiDocument.ts";
  import { seedCatalog } from "$lib/openapi/seedCatalog.ts";
  import EndpointSidebar from "./EndpointSidebar.svelte";
  import EnvironmentSelector from "./EnvironmentSelector.svelte";
  import { hasInvalidJsonBody } from "./hasInvalidJsonBody.ts";
  import { hasInvalidParameterValues } from "./invalidParameterIds.ts";
  import { hasMissingExpectedJsonBody } from "./hasMissingExpectedJsonBody.ts";
  import { hasMissingRequiredParameters } from "./hasMissingRequiredParameters.ts";
  import RequestEditor from "./RequestEditor.svelte";
  import type { RequestEditorTab } from "./RequestEditorProps.ts";
  import type { ResponseHistoryEntry } from "./ResponseHistoryEntry.ts";
  import {
    loadResponseHistory,
    saveResponseHistory,
  } from "./responseHistoryStorage.ts";
  import { resolveEndpointServer } from "./resolveEndpointServer.ts";
  import {
    decodeRequestUrlState,
    encodeRequestUrlState,
    type RequestUrlState,
  } from "./requestUrlState.ts";
  import ResponseInspector from "./ResponseInspector.svelte";

  const isReference = $derived(
    page.url.searchParams.get("section") === "reference" ||
      (!page.url.searchParams.has("section") &&
        (page.url.searchParams.has("operation") ||
          page.url.hash.startsWith("#v="))),
  );

  const DEFAULT_SERVER = "https://api.trakt.tv";
  const MAIN_SERVERS = [
    { label: "Public", host: "api.trakt.tv", url: DEFAULT_SERVER },
    { label: "Premium", host: "apiz.trakt.tv", url: "https://apiz.trakt.tv" },
  ] as const;
  const MAIN_SERVER_URLS: ReadonlySet<string> = new Set(
    MAIN_SERVERS.map((server) => server.url),
  );
  const SIDEBAR_MIN_WIDTH = 240;
  const SIDEBAR_MAX_WIDTH = 560;
  const REQUEST_MIN_WIDTH = 600;
  const REQUEST_MAX_WIDTH = 1_200;
  const RESIZE_STEP = 24;

  type ResizablePanel = "sidebar" | "request";
  type ActiveResize = {
    panel: ResizablePanel;
    pointerId: number;
    startX: number;
    startWidth: number;
  };
  type ResizerPointerEvent = PointerEvent & {
    currentTarget: HTMLButtonElement;
  };

  let catalog = $state<OpenApiCatalog>(seedCatalog);
  let query = $state("");
  let selectedId = $state(seedCatalog.endpoints.at(0)?.id ?? "");
  let mainServerUrl = $state(DEFAULT_SERVER);
  let serverUrl = $state(DEFAULT_SERVER);
  let values = $state<Record<string, string>>({});
  let headers = $state<Array<ApiHeader>>([]);
  let requestBody = $state("");
  let requestUrl = $state("");
  let activeTab = $state<RequestEditorTab>("params");
  let responseHistory = $state<Array<ResponseHistoryEntry>>([]);
  let isSending = $state(false);
  let isLoadingCatalog = $state(true);
  let requestError = $state("");
  let accounts = $state<ReadonlyArray<DeveloperAccount>>([]);
  let sessionGeneration = 0;
  let selectedAccountSlot = $state<number | null>(null);
  let authorizationEnabled = $state(true);
  let sidebarWidth = $state(310);
  let requestPanelWidth = $state(760);
  let activeResize = $state<ActiveResize | null>(null);
  let isUrlStateReady = $state(false);

  const filteredEndpoints = $derived(
    filterEndpoints({ endpoints: catalog.endpoints, query }),
  );
  const selectedEndpoint = $derived(
    catalog.endpoints.find((endpoint) => endpoint.id === selectedId) ??
      catalog.endpoints.at(0),
  );
  const isSendDisabled = $derived(
    isSending ||
      !selectedEndpoint ||
      hasMissingRequiredParameters({
        endpoint: selectedEndpoint,
        values,
        headers,
      }) ||
      hasMissingExpectedJsonBody({
        endpoint: selectedEndpoint,
        body: requestBody,
      }) ||
      hasInvalidJsonBody({
        endpoint: selectedEndpoint,
        body: requestBody,
      }) ||
      hasInvalidParameterValues({
        endpoint: selectedEndpoint,
        values,
        headers,
      }),
  );

  $effect(() => {
    if (!isReference || !isUrlStateReady || !selectedEndpoint) return;

    const fragment = encodeRequestUrlState({
      endpoint: selectedEndpoint,
      mainServerUrl,
      serverUrl,
      values,
      headers,
      body: requestBody,
      activeTab,
    });
    if (globalThis.location.hash === fragment) return;

    const nextUrl = new URL(globalThis.location.href);
    nextUrl.searchParams.delete("operation");
    nextUrl.hash = fragment;
    globalThis.history.replaceState(globalThis.history.state, "", nextUrl);
  });

  function initialValues(endpoint: Endpoint): Record<string, string> {
    return Object.fromEntries(
      endpoint.parameters.map((parameter) => [
        parameter.id,
        parameter.defaultValue,
      ]),
    );
  }

  function managedHeaders(endpoint: Endpoint): Array<ApiHeader> {
    const documented = endpoint.parameters
      .filter(
        (parameter) =>
          parameter.location === "header" &&
          (endpoint.auth !== "endpoint" ||
            parameter.name.toLocaleLowerCase() !== "authorization"),
      )
      .map((parameter) => ({
        id: parameterHeaderId(parameter.id),
        name: parameter.name,
        value: parameter.defaultValue,
        enabled: Boolean(parameter.defaultValue),
      }));

    const authorizationHeader: Array<ApiHeader> =
      endpoint.auth === "endpoint"
        ? []
        : [
            {
              id: MANAGED_AUTHORIZATION_HEADER_ID,
              name: "Authorization",
              value:
                selectedAccountSlot === null
                  ? "Not attached"
                  : "Bearer ••••••••",
              enabled: selectedAccountSlot !== null && authorizationEnabled,
              managed: true,
            },
          ];

    return [
      {
        id: "managed-api-key",
        name: "trakt-api-key",
        value: "••••••••",
        enabled: true,
        managed: true,
      },
      {
        id: "managed-api-version",
        name: "trakt-api-version",
        value: "2",
        enabled: true,
        managed: true,
      },
      {
        id: "managed-user-agent",
        name: "User-Agent",
        value: "TraktDeveloper/1.0.0",
        enabled: true,
        managed: true,
      },
      ...authorizationHeader,
      {
        id: "accept",
        name: "Accept",
        value: "application/json",
        enabled: true,
      },
      ...documented,
    ];
  }

  function selectEndpoint(endpoint: Endpoint) {
    const nextValues = initialValues(endpoint);
    const preferredServer = resolveEndpointServer({ endpoint, mainServerUrl });
    authorizationEnabled = true;
    selectedId = endpoint.id;
    serverUrl = preferredServer;
    values = nextValues;
    headers = managedHeaders(endpoint);
    requestBody = "";
    requestUrl = buildEndpointUrl({ endpoint, serverUrl, values: nextValues });
    activeTab =
      endpoint.parameters.length > 0
        ? "params"
        : endpoint.requestBody
          ? "body"
          : "headers";
    requestError = "";
  }

  function isValidTab(tab: RequestEditorTab): boolean {
    return ["params", "headers", "body"].includes(tab);
  }

  function restoreRequestState({
    endpoint,
    state,
  }: {
    endpoint: Endpoint;
    state: RequestUrlState;
  }) {
    mainServerUrl = MAIN_SERVER_URLS.has(state.mainServerUrl)
      ? state.mainServerUrl
      : DEFAULT_SERVER;
    selectEndpoint(endpoint);
    authorizationEnabled = state.authorizationEnabled;

    const allowedParameterIds = new Set(
      endpoint.parameters.map((parameter) => parameter.id),
    );
    const restoredValues = Object.fromEntries(
      Object.entries(state.values).filter(([id]) =>
        allowedParameterIds.has(id),
      ),
    );
    const restoredHeaderIds = new Set(state.headers.map((header) => header.id));
    const defaultHeaders = managedHeaders(endpoint);

    serverUrl = resolveEndpointServer({
      endpoint,
      mainServerUrl,
      requestServerUrl: state.serverUrl,
    });
    values = { ...initialValues(endpoint), ...restoredValues };
    headers = [
      ...defaultHeaders.filter(
        (header) =>
          header.managed === true || !restoredHeaderIds.has(header.id),
      ),
      ...state.headers,
    ];
    requestBody = state.body;
    activeTab = isValidTab(state.activeTab) ? state.activeTab : activeTab;
    requestUrl = buildEndpointUrl({ endpoint, serverUrl, values });
  }

  function setValue(id: string, value: string) {
    if (!selectedEndpoint) return;
    values = { ...values, [id]: value };
    requestUrl = buildEndpointUrl({
      endpoint: selectedEndpoint,
      serverUrl,
      values,
    });

    const headerId = parameterHeaderId(id);
    headers = headers.map((header) =>
      header.id === headerId
        ? { ...header, value, enabled: Boolean(value) }
        : header,
    );
  }

  function setHeader(
    id: string,
    field: "name" | "value" | "enabled",
    value: string | boolean,
  ) {
    if (id === MANAGED_AUTHORIZATION_HEADER_ID && field === "enabled") {
      authorizationEnabled = value === true;
    }

    headers = headers.map((header) =>
      header.id === id ? ({ ...header, [field]: value } as ApiHeader) : header,
    );
  }

  function setServer(value: string) {
    if (!selectedEndpoint) return;
    if (!selectedEndpoint.serverUrls.includes(value)) return;
    serverUrl = value;
    requestUrl = buildEndpointUrl({
      endpoint: selectedEndpoint,
      serverUrl,
      values,
    });
  }

  function setMainServer(value: string) {
    if (!MAIN_SERVER_URLS.has(value)) return;
    mainServerUrl = value;
    if (!selectedEndpoint || !selectedEndpoint.serverUrls.includes(value))
      return;

    serverUrl = value;
    requestUrl = buildEndpointUrl({
      endpoint: selectedEndpoint,
      serverUrl,
      values,
    });
  }

  function setSelectedAccount(slot: number | null) {
    selectedAccountSlot = slot;
    if (!selectedEndpoint) return;

    headers = [
      ...managedHeaders(selectedEndpoint).filter(
        (header) => header.managed === true,
      ),
      ...headers.filter((header) => header.managed !== true),
    ];
  }

  function deleteResponse(id: string) {
    responseHistory = responseHistory.filter((entry) => entry.id !== id);
    saveResponseHistory({
      storage: globalThis.sessionStorage,
      entries: responseHistory,
    });
  }

  function logOutAccount(slot: number) {
    sessionGeneration += 1;
    accounts = accounts.filter((account) => account.slot !== slot);
    setSelectedAccount(null);
    responseHistory = [];
    try {
      globalThis.sessionStorage.removeItem("trakt-developer-response-history");
      globalThis.sessionStorage.removeItem("trakt-playground-response-history");
    } finally {
      // A fresh page discards request inputs, URL state, and pending API responses.
      globalThis.location.replace(globalThis.location.pathname);
    }
  }

  async function refreshAccounts() {
    const generation = sessionGeneration;
    const accountState = await fetchAccounts();
    if (generation !== sessionGeneration) return;
    accounts = accountState.accounts;
    if (accounts.some((account) => account.slot === selectedAccountSlot))
      return;

    const account = accounts.at(0);
    setSelectedAccount(account?.slot ?? null);
  }

  async function sendRequest() {
    if (!selectedEndpoint || isSendDisabled) return;
    const endpoint = selectedEndpoint;
    const generation = sessionGeneration;
    const request = {
      method: endpoint.method,
      url: requestUrl,
    };
    requestError = "";
    isSending = true;
    try {
      const response = await executeApiRequest({
        method: request.method,
        url: request.url,
        headers,
        body: requestBody,
        accountSlot: headers.find(
          ({ id }) => id === MANAGED_AUTHORIZATION_HEADER_ID,
        )?.enabled
          ? selectedAccountSlot
          : null,
      });
      if (generation !== sessionGeneration) return;
      const sequence =
        responseHistory
          .filter((entry) => entry.endpointId === endpoint.id)
          .reduce((maximum, entry) => Math.max(maximum, entry.sequence), 0) + 1;
      const nextHistory = [
        ...responseHistory,
        {
          id: crypto.randomUUID(),
          endpointId: endpoint.id,
          sequence,
          receivedAt: new Date().toISOString(),
          request,
          response,
        },
      ].slice(-20);
      responseHistory = nextHistory;
      saveResponseHistory({
        storage: globalThis.sessionStorage,
        entries: nextHistory,
      });
    } catch (error) {
      if (generation === sessionGeneration) {
        requestError =
          error instanceof Error ? error.message : "The request failed.";
      }
    } finally {
      if (generation === sessionGeneration) isSending = false;
    }
  }

  function openOperationLink() {
    const operationId = page.url.searchParams.get("operation");
    if (!isReference || !operationId) return;
    const endpoint = catalog.endpoints.find(
      (endpoint) => endpoint.operationId === operationId,
    );
    if (endpoint) {
      query = "";
      selectEndpoint(endpoint);
    }
  }

  afterNavigate(() => {
    if (isUrlStateReady) openOperationLink();
  });

  async function loadCatalog(sharedState: RequestUrlState | null) {
    isLoadingCatalog = true;
    let nextCatalog = catalog;
    try {
      const openApiResponse = await fetch("/openapi.json");
      if (openApiResponse.ok) {
        const document = await openApiResponse.json();
        nextCatalog = parseOpenApiDocument({
          document,
          source: "Repository OpenAPI specification",
        });
        catalog = nextCatalog;
      }
    } catch {
      // The bundled starter catalog remains usable if the repository spec cannot be loaded.
    } finally {
      const replacement =
        nextCatalog.endpoints.find(
          (endpoint) => endpoint.id === sharedState?.endpointId,
        ) ??
        nextCatalog.endpoints.find(
          (endpoint) => endpoint.operationId === selectedEndpoint?.operationId,
        ) ??
        nextCatalog.endpoints.at(0);

      if (replacement && sharedState?.endpointId === replacement.id) {
        restoreRequestState({ endpoint: replacement, state: sharedState });
      } else if (replacement) {
        selectEndpoint(replacement);
      }

      if (!sharedState) openOperationLink();
      isLoadingCatalog = false;
      isUrlStateReady = true;
    }
  }

  function focusSearch(event: KeyboardEvent) {
    if (
      (event.metaKey || event.ctrlKey) &&
      event.key.toLocaleLowerCase() === "k"
    ) {
      event.preventDefault();
      document.querySelector<HTMLInputElement>("#endpoint-search")?.focus();
    }
  }

  function clampPanelWidth(panel: ResizablePanel, width: number): number {
    const minimum = panel === "sidebar" ? SIDEBAR_MIN_WIDTH : REQUEST_MIN_WIDTH;
    const maximum = panel === "sidebar" ? SIDEBAR_MAX_WIDTH : REQUEST_MAX_WIDTH;
    return Math.min(maximum, Math.max(minimum, width));
  }

  function setPanelWidth(panel: ResizablePanel, width: number) {
    const nextWidth = clampPanelWidth(panel, width);
    if (panel === "sidebar") {
      sidebarWidth = nextWidth;
      return;
    }

    requestPanelWidth = nextWidth;
  }

  function startPanelResize(panel: ResizablePanel, event: ResizerPointerEvent) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    activeResize = {
      panel,
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: panel === "sidebar" ? sidebarWidth : requestPanelWidth,
    };
  }

  function continuePanelResize(event: ResizerPointerEvent) {
    if (!activeResize || activeResize.pointerId !== event.pointerId) return;
    setPanelWidth(
      activeResize.panel,
      activeResize.startWidth + event.clientX - activeResize.startX,
    );
  }

  function stopPanelResize(event: ResizerPointerEvent) {
    if (!activeResize || activeResize.pointerId !== event.pointerId) return;
    activeResize = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function resizePanelWithKeyboard(
    panel: ResizablePanel,
    event: KeyboardEvent,
  ) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentWidth = panel === "sidebar" ? sidebarWidth : requestPanelWidth;
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    setPanelWidth(panel, currentWidth + direction * RESIZE_STEP);
  }

  onMount(() => {
    responseHistory = loadResponseHistory(globalThis.sessionStorage);
    const sharedState = decodeRequestUrlState(globalThis.location.hash);
    const initial =
      catalog.endpoints.find(
        (endpoint) => endpoint.id === sharedState?.endpointId,
      ) ?? selectedEndpoint;
    if (initial && sharedState?.endpointId === initial.id) {
      restoreRequestState({ endpoint: initial, state: sharedState });
    } else if (initial) {
      selectEndpoint(initial);
    }

    globalThis.addEventListener("keydown", focusSearch);
    globalThis.addEventListener("focus", refreshAccounts);
    void Promise.all([loadCatalog(sharedState), refreshAccounts()]);
    return () => {
      globalThis.removeEventListener("keydown", focusSearch);
      globalThis.removeEventListener("focus", refreshAccounts);
    };
  });
</script>

<main class="trakt-developer-app">
  <header class="app-header">
    <a class="brand" href="/" aria-label="Trakt Developer home">
      <img class="brand-mark" src="/trakt-logomark.svg" alt="" />
      <span class="brand-copy"
        ><strong>Trakt</strong><span>Developer</span></span
      >
    </a>
    <nav class="section-navigation" aria-label="Developer sections">
      <a
        href="/?section=guides"
        aria-current={!isReference ? "page" : undefined}>Getting Started</a
      >
      <a
        href="/?section=reference"
        aria-current={isReference ? "page" : undefined}>API Reference</a
      >
      <a
        href="https://github.com/trakt/trakt-api"
        target="_blank"
        rel="noreferrer">Support</a
      >
    </nav>
  </header>

  {#if !isReference}
    <GuideReader
      slug={page.url.searchParams.get("guide")}
      endpoints={catalog.endpoints}
    />
  {:else}
    <div
      class="workspace"
      style={`--sidebar-width: ${sidebarWidth}px; --request-width: ${requestPanelWidth}px`}
    >
      <div class="sidebar">
        <EndpointSidebar
          endpoints={filteredEndpoints}
          {selectedId}
          {query}
          isLoading={isLoadingCatalog}
          onQuery={(value) => (query = value)}
          onSelect={selectEndpoint}
        />
        <div class="sidebar-environment">
          <EnvironmentSelector
            {accounts}
            serverUrl={mainServerUrl}
            servers={MAIN_SERVERS}
            selectedSlot={selectedAccountSlot}
            onAccount={setSelectedAccount}
            onServer={setMainServer}
            onLogout={logOutAccount}
            onAccountsChanged={refreshAccounts}
          />
        </div>
      </div>

      <button
        type="button"
        class="panel-resizer"
        class:is-active={activeResize?.panel === "sidebar"}
        aria-label="Resize endpoint navigation"
        title="Drag or use the left and right arrow keys"
        onpointerdown={(event) => startPanelResize("sidebar", event)}
        onpointermove={continuePanelResize}
        onpointerup={stopPanelResize}
        onpointercancel={stopPanelResize}
        onkeydown={(event) => resizePanelWithKeyboard("sidebar", event)}
      ></button>

      {#if selectedEndpoint}
        <RequestEditor
          endpoint={selectedEndpoint}
          url={requestUrl}
          {serverUrl}
          showServerOverride={!selectedEndpoint.serverUrls.includes(
            mainServerUrl,
          )}
          {values}
          {headers}
          body={requestBody}
          {activeTab}
          {isSending}
          errorMessage={requestError}
          onServer={setServer}
          onValue={setValue}
          onHeader={setHeader}
          onAddHeader={() =>
            (headers = [
              ...headers,
              { id: crypto.randomUUID(), name: "", value: "", enabled: true },
            ])}
          onRemoveHeader={(id) =>
            (headers = headers.filter((header) => header.id !== id))}
          onBody={(value) => (requestBody = value)}
          onTab={(tab) => (activeTab = tab)}
          onSend={sendRequest}
        />
      {/if}

      <button
        type="button"
        class="panel-resizer"
        class:is-active={activeResize?.panel === "request"}
        aria-label="Resize request and response panels"
        title="Drag or use the left and right arrow keys"
        onpointerdown={(event) => startPanelResize("request", event)}
        onpointermove={continuePanelResize}
        onpointerup={stopPanelResize}
        onpointercancel={stopPanelResize}
        onkeydown={(event) => resizePanelWithKeyboard("request", event)}
      ></button>

      {#if selectedEndpoint}
        <ResponseInspector
          endpoint={selectedEndpoint}
          history={responseHistory}
          {isSending}
          onDeleteResponse={deleteResponse}
        />
      {/if}
    </div>
  {/if}
</main>

<style lang="scss">
  .trakt-developer-app {
    display: grid;
    width: 100%;
    min-width: 320px;
    height: 100%;
    min-height: 0;

    overflow: hidden;
    grid-template-rows: 58px minmax(0, 1fr);

    .app-header {
      position: relative;
      z-index: 20;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ni-18);

      padding-inline: 15px;
      border-block-end: var(--ni-1) solid var(--color-border);

      background: color-mix(in srgb, var(--color-surface) 94%, transparent);
      backdrop-filter: blur(var(--ni-16));
    }

    .brand {
      display: flex;
      align-items: center;
      gap: var(--ni-10);

      color: var(--color-foreground);
      text-decoration: none;
    }

    .brand-mark {
      display: block;

      width: 31px;
      height: 31px;
      flex: 0 0 auto;
    }

    .brand-copy {
      display: flex;
      align-items: baseline;
      gap: var(--ni-8);

      white-space: nowrap;
    }

    .brand-copy strong {
      font-size: var(--ni-14);
    }

    .brand-copy span {
      color: var(--color-muted);
      font-size: var(--ni-12);
    }

    .section-navigation {
      display: flex;
      align-self: stretch;
      gap: var(--ni-24);

      margin-inline-end: auto;
      margin-inline-start: var(--ni-24);
    }

    .section-navigation a {
      display: flex;
      align-items: center;

      color: var(--color-link);
      font-size: 13px;
      text-decoration: none;
      white-space: nowrap;
    }

    .section-navigation a[aria-current="page"] {
      color: var(--color-link-current);
    }

    .section-navigation a:hover,
    .section-navigation a:focus-visible {
      color: var(--color-link-hover);
    }

    @media (max-width: 640px) {
      .app-header .brand-copy {
        display: none;
      }

      .section-navigation {
        margin-inline-start: 0;
        gap: var(--ni-12);
      }

      .section-navigation a {
        font-size: var(--ni-12);
      }
    }

    .workspace {
      display: grid;
      min-width: 0;
      min-height: 0;

      overflow-x: auto;
      overflow-y: hidden;
      grid-template-columns:
        var(--sidebar-width) var(--ni-1) var(--request-width) var(--ni-1)
        minmax(360px, 1fr);
    }

    .sidebar {
      display: grid;
      grid-template-rows: minmax(0, 1fr) auto;

      min-height: 0;
      min-width: 0;

      background: var(--color-surface);
    }

    .sidebar-environment {
      padding: var(--ni-12);
      border-block-start: var(--ni-1) solid var(--color-border);
    }

    .panel-resizer {
      position: relative;
      z-index: 10;

      min-width: 0;
      padding: 0;

      border: 0;
      background: transparent;

      cursor: col-resize;
      touch-action: none;
    }

    .panel-resizer::before {
      position: absolute;
      inset-block: 0;
      inset-inline: -3px;

      content: "";
    }

    .panel-resizer::after {
      position: absolute;
      inset: 0;

      background: var(--color-border);
      content: "";
      transition: background-color 120ms ease;
    }

    .panel-resizer:hover::after,
    .panel-resizer:focus-visible::after,
    .panel-resizer.is-active::after {
      background: var(--color-info);
    }
  }
</style>
