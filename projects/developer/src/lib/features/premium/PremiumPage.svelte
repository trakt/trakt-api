<script lang="ts">
  import { onMount } from "svelte";
  import type { PendingCheckout } from "$lib/api/PendingCheckout.ts";
  import { readPendingCheckout } from "$lib/api/readPendingCheckout.ts";
  import { savePendingCheckout } from "$lib/api/savePendingCheckout.ts";
  import { portalSession } from "$lib/auth/portalSession.ts";
  import { checkoutReturn } from "./checkoutReturn.ts";
  import PremiumAccount from "./PremiumAccount.svelte";

  const session = portalSession();

  let returnCaptured = $state(false);
  const slot = $derived(
    returnCaptured ? (session.account?.slot ?? null) : null,
  );

  onMount(() => {
    const url = new URL(globalThis.location.href);
    const outcome = checkoutReturn(url.searchParams);
    const kept =
      outcome?.kind === "success" &&
      !savePendingCheckout({
        storage: globalThis.localStorage,
        pending: attachSession(outcome.sessionId),
      });
    if (outcome && !kept) {
      url.searchParams.delete("session_id");
      url.searchParams.delete("checkout");
      globalThis.history.replaceState(globalThis.history.state, "", url);
    }
    returnCaptured = true;
  });

  function attachSession(sessionId: string): PendingCheckout | null {
    const started = readPendingCheckout(globalThis.localStorage);
    return started ? { slot: started.slot, sessionId } : null;
  }
</script>

<div class="trakt-premium-page">
  <div class="content">
    <header class="hero">
      <span class="eyebrow">Plans</span>
      <h1 class="hero-title">Build on Trakt at scale</h1>
      <p class="hero-copy">
        Every developer starts on Standard. Premium raises your rate limits,
        opens more of the API, and keeps your apps outside the community app
        limit.
      </p>
    </header>

    {#key slot}
      <PremiumAccount {slot} />
    {/key}

    {#if !session.account}
      <p class="sign-in-hint" role="status">
        {session.loading
          ? "Loading your account…"
          : "Sign in from the header to upgrade. Plans apply to your developer account and every app it owns."}
      </p>
    {/if}

    <section class="notes" aria-labelledby="notes-title">
      <h2 class="notes-title" id="notes-title">Good to know</h2>
      <dl class="notes-list">
        <div class="note">
          <dt class="note-term">Switching hosts</dt>
          <dd class="note-text">
            Point your base URL at <code class="inline-code">apiz.trakt.tv</code
            >. Paths, headers, and OAuth stay the same. Standard apps calling
            <code class="inline-code">apiz.trakt.tv</code> are rejected.
          </dd>
        </div>
        <div class="note">
          <dt class="note-term">Billing</dt>
          <dd class="note-text">
            Checkout and invoices run on Stripe, the same as Trakt VIP. Cancel
            any time; Premium stays active until the end of the paid month.
          </dd>
        </div>
        <div class="note">
          <dt class="note-term">Trakt VIP is separate</dt>
          <dd class="note-text">
            VIP is for Trakt users and their accounts. Premium is for developers
            and the apps they build.
          </dd>
        </div>
      </dl>
      <a class="guide-link" href="/docs/premium">Read the Premium guide →</a>
    </section>
  </div>
</div>

<style lang="scss">
  .trakt-premium-page {
    overflow: auto;
    padding: var(--ni-48) var(--ni-32);

    .content {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-40);
      max-width: var(--ni-920);
      margin: auto;
    }

    .hero {
      display: grid;
      gap: var(--gap-s);
      justify-items: center;
      text-align: center;
    }

    .eyebrow {
      color: var(--color-accent-hover);
      font-size: var(--ni-11);
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .hero-title {
      margin: 0;
      font-size: var(--ni-40);
      letter-spacing: -0.04em;
    }

    .hero-copy {
      max-width: var(--ni-520);
      margin: 0;
      color: var(--color-muted);
      font-size: var(--ni-16);
      line-height: 1.65;
    }

    .sign-in-hint {
      margin: var(--ni-neg-20) 0 0;
      color: var(--color-muted);
      font-size: var(--ni-14);
      text-align: center;
    }

    .notes {
      display: grid;
      gap: var(--gap-m);
      margin-block-start: var(--ni-24);
    }

    .notes-title {
      margin: 0;
      font-size: var(--ni-20);
      letter-spacing: -0.02em;
    }

    .notes-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(var(--ni-240), 1fr));
      gap: var(--gap-l);
      margin: 0;
    }

    .note-term {
      margin-block-end: var(--gap-xxs);
      font-size: var(--ni-14);
      font-weight: 600;
    }

    .note-text {
      margin: 0;
      color: var(--color-muted);
      font-size: var(--ni-14);
      line-height: 1.6;
    }

    .inline-code {
      font-family: var(--font-mono);
      font-size: 0.92em;
      color: var(--color-code);
    }

    .guide-link {
      justify-self: start;
      color: var(--color-info);
      font-size: var(--ni-14);
    }
  }

  // Breakpoints cannot read custom properties, so this one stays literal.
  @media (max-width: 700px) {
    .trakt-premium-page {
      padding: var(--ni-28) var(--ni-16);
    }

    .trakt-premium-page .hero-title {
      font-size: var(--ni-30);
    }
  }
</style>
