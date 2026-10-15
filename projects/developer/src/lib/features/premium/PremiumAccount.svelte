<script lang="ts">
  import { onMount } from "svelte";
  import { cancelPremiumSubscription } from "$lib/api/cancelPremiumSubscription.ts";
  import { confirmPremiumCheckout } from "$lib/api/confirmPremiumCheckout.ts";
  import { fetchPremiumAmount } from "$lib/api/fetchPremiumAmount.ts";
  import { readPendingCheckout } from "$lib/api/readPendingCheckout.ts";
  import { savePendingCheckout } from "$lib/api/savePendingCheckout.ts";
  import { startPremiumCheckout } from "$lib/api/startPremiumCheckout.ts";
  import { updatePaymentMethodUrl } from "$lib/api/updatePaymentMethodUrl.ts";
  import type { DeveloperProfile } from "$lib/features/apps/DeveloperProfile.ts";
  import { getDeveloperProfile } from "$lib/features/apps/getDeveloperProfile.ts";
  import type { DeveloperTier } from "./DeveloperTier.ts";
  import { PREMIUM_PLAN } from "./PREMIUM_PLAN.ts";
  import PremiumPlans from "./PremiumPlans.svelte";
  import { premiumReturnUrls } from "./premiumReturnUrls.ts";
  import { premiumAccountReloaders } from "./premiumAccountReloaders.ts";
  import PremiumSubscriptionCard from "./PremiumSubscriptionCard.svelte";

  const { slot }: { slot: number | null } = $props();

  let profile = $state<DeveloperProfile | null>(null);
  let amount = $state(PREMIUM_PLAN.amount);
  let busy = $state(false);
  let error = $state("");
  let alive = true;
  let loadGeneration = 0;

  const tier = $derived<DeveloperTier | null>(
    slot === null ? "standard" : profile && (profile.tier ?? "standard"),
  );
  const subscription = $derived(profile?.subscription ?? null);

  onMount(() => {
    if (slot === null) return;
    const current = slot;
    const reload = () => {
      profile = null;
      void refresh(current);
    };
    premiumAccountReloaders.set(current, reload);
    void prime(current);

    return () => {
      alive = false;
      if (premiumAccountReloaders.get(current) === reload) {
        premiumAccountReloaders.delete(current);
      }
    };
  });

  function fail(cause: unknown, fallback: string) {
    if (!alive) return;
    error = cause instanceof Error ? cause.message : fallback;
  }

  async function prime(current: number) {
    void loadAmount(current);
    const pending = readPendingCheckout(globalThis.localStorage);
    if (pending?.slot === current && pending.sessionId) {
      await confirm(current, pending.sessionId);
    }
    await refresh(current);
  }

  async function loadAmount(current: number) {
    const livePrice = await fetchPremiumAmount(current);
    if (alive && livePrice !== null) amount = livePrice;
  }

  async function refresh(current: number) {
    const load = ++loadGeneration;
    try {
      const developer = await getDeveloperProfile(current);
      if (!alive || load !== loadGeneration) return;
      profile = developer;
    } catch (cause) {
      if (load !== loadGeneration) return;
      fail(cause, "Your plan could not be loaded. Reload to try again.");
    }
  }

  async function confirm(current: number, sessionId: string) {
    try {
      await confirmPremiumCheckout({ slot: current, sessionId });
      savePendingCheckout({ storage: globalThis.localStorage, pending: null });
    } catch (cause) {
      fail(cause, "The checkout could not be confirmed.");
    }
  }

  async function redirect(
    request: (urls: {
      slot: number;
      successUrl: string;
      cancelUrl: string;
    }) => Promise<string>,
    failure: string,
  ) {
    if (busy || slot === null || profile === null) return;
    busy = true;
    error = "";
    try {
      const url = await request({
        slot,
        ...premiumReturnUrls(globalThis.location.origin),
      });
      if (!alive) return;
      const saved = savePendingCheckout({
        storage: globalThis.localStorage,
        pending: { slot, sessionId: null },
      });
      if (!saved) {
        busy = false;
        error =
          "Your browser blocked the site storage this checkout needs. Allow site data for this site and try again.";
        return;
      }
      globalThis.location.assign(url);
    } catch (cause) {
      if (!alive) return;
      busy = false;
      fail(cause, failure);
    }
  }

  function upgrade() {
    void redirect(startPremiumCheckout, "Checkout could not start.");
  }

  function updatePayment() {
    void redirect(
      updatePaymentMethodUrl,
      "The billing page could not be opened.",
    );
  }

  async function cancel() {
    if (busy || slot === null) return;
    busy = true;
    error = "";
    try {
      await cancelPremiumSubscription(slot);
      premiumAccountReloaders.get(slot)?.();
    } catch (cause) {
      fail(cause, "The plan could not be cancelled.");
    } finally {
      if (alive) busy = false;
    }
  }
</script>

<div class="trakt-premium-account">
  {#if error}<p class="message error" role="alert">{error}</p>{/if}

  <div class="plans">
    {#if tier === "premium" && subscription}
      <PremiumSubscriptionCard
        {subscription}
        {busy}
        onUpdatePayment={updatePayment}
        onCancel={cancel}
      />
    {/if}

    <PremiumPlans
      {tier}
      {amount}
      signedIn={slot !== null}
      ready={profile !== null}
      {busy}
      onUpgrade={upgrade}
    />
  </div>
</div>

<style lang="scss">
  .trakt-premium-account {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-40);

    .plans {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--gap-l);
    }

    .message {
      margin: 0;
      padding: var(--gap-m);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--radius-control);
      font-size: var(--ni-14);
    }

    .message.error {
      color: var(--color-danger);
    }
  }
</style>
