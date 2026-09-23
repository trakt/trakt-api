<script lang="ts">
  import { portalSession } from "$lib/auth/portalSession.ts";
  import { applicationCrumb, applicationTitle } from "./applicationTitle.ts";
  import { applicationUrl } from "./applicationUrl.ts";
  import Applications from "./Applications.svelte";
  import type { ApplicationPageProps } from "./ApplicationPageProps.ts";

  const { mode, appId, appName }: ApplicationPageProps = $props();
  const session = portalSession();
  const displayName = $derived(
    appName ?? (session.loading ? "Loading…" : "App details"),
  );
  const title = $derived(applicationTitle(mode, displayName));
</script>

<svelte:head
  >{#if !session.account}<title>{title} | Trakt Developer</title
    >{/if}</svelte:head
>

{#if session.account}
  {#key `${session.account.slot}:${mode}:${appId ?? ""}`}
    <Applications slot={session.account.slot} {mode} {appId} {appName} />
  {/key}
{:else}
  <section class="welcome">
    <nav aria-label="Breadcrumb">
      <a href="/apps" aria-current={mode === "list" ? "page" : undefined}
        >My Apps</a
      >
      {#if mode === "edit"}
        / <a href={applicationUrl(appId, appName)}>{displayName}</a>
      {/if}
      {#if mode !== "list"}
        / <span aria-current="page">{applicationCrumb(mode, displayName)}</span>
      {/if}
    </nav>
    <h1>{title}</h1>
    <p role="status">
      {session.loading
        ? "Loading your account…"
        : "Sign in using the header to manage your apps and API credentials."}
    </p>
  </section>
{/if}

<style>
  .welcome {
    padding: 48px 32px;
    overflow: auto;
  }

  h1 {
    margin: 8px 0 0;
  }

  p {
    margin: 6px 0 0;
  }

  nav,
  p {
    color: var(--color-muted);
    font-size: 14px;
  }

  a {
    color: var(--color-info);
  }
</style>
