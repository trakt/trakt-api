<script lang="ts">
  import { formatDate } from "$lib/features/apps/formatDate.ts";
  import { PREMIUM_PLAN } from "./PREMIUM_PLAN.ts";
  import type { PremiumSubscriptionCardProps } from "./PremiumSubscriptionCardProps.ts";
  import TierBadge from "./TierBadge.svelte";

  const {
    subscription,
    busy,
    onUpdatePayment,
    onCancel,
  }: PremiumSubscriptionCardProps = $props();

  let confirmDialog = $state<HTMLDialogElement | null>(null);

  const renewal = $derived(formatDate(subscription.renews_at));
  const active = $derived(subscription.status === "active");
  const status = $derived(
    active
      ? `Premium, ${PREMIUM_PLAN.billedLabel}. Renews ${renewal}.`
      : `Cancelled. Premium stays active until ${renewal}. You can subscribe again after that date.`,
  );

  // Focus the dialog itself so no button shows a focus ring until the user tabs.
  function openConfirm() {
    if (!confirmDialog) return;
    // A previous "confirm" would otherwise survive and fire again on Escape.
    confirmDialog.returnValue = "";
    confirmDialog.showModal();
    confirmDialog.focus();
  }
</script>

<section class="trakt-premium-subscription-card" aria-label="Your plan">
  <div class="plan-copy">
    <div class="plan-heading">
      <span class="eyebrow">Your plan</span>
      <TierBadge tier="premium" />
    </div>
    <p class="status">{status}</p>
  </div>

  {#if active}
    <div class="actions">
      <button
        type="button"
        class="action"
        disabled={busy}
        onclick={onUpdatePayment}>Update payment method</button
      ><button
        type="button"
        class="action destructive"
        disabled={busy}
        onclick={openConfirm}>Cancel plan</button
      >
    </div>
  {/if}

  <dialog
    class="confirm-dialog"
    bind:this={confirmDialog}
    tabindex="-1"
    aria-labelledby="cancel-plan-title"
    onclose={() => {
      if (confirmDialog?.returnValue === "confirm") onCancel();
    }}
  >
    <form class="confirm-form" method="dialog">
      <h2 class="confirm-title" id="cancel-plan-title">Cancel Premium?</h2>
      <p class="confirm-text">
        Your apps keep Premium until {renewal}, then move back to Standard and
        <code class="inline-code">api.trakt.tv</code>.
      </p>
      <div class="actions">
        <button type="submit" class="action" value="keep">Keep Premium</button
        ><button type="submit" class="action destructive" value="confirm"
          >Cancel plan</button
        >
      </div>
    </form>
  </dialog>
</section>

<style lang="scss">
  @use "../../../style/action-button" as action;

  .trakt-premium-subscription-card {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
    width: 100%;
    max-width: var(--ni-768);
    margin-inline: auto;
    padding: var(--gap-l);
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--radius-large);
    background: var(--color-surface);

    .plan-copy {
      display: grid;
      gap: var(--gap-xs);
      min-width: 0;
    }

    .plan-heading {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
    }

    .eyebrow {
      color: var(--color-muted);
      font-size: var(--ni-11);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .status {
      margin: 0;
      font-size: var(--ni-14);
      line-height: 1.6;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xs);
    }

    .action {
      @include action.base;
    }

    .destructive {
      color: var(--color-danger);
    }

    .inline-code {
      font-family: var(--font-mono);
      font-size: 0.92em;
      color: var(--color-code);
    }

    .confirm-dialog {
      width: min(var(--ni-480), calc(100vw - var(--gap-xl)));
      padding: var(--gap-l);
      border: var(--border-thickness-xxs) solid var(--color-border-strong);
      border-radius: var(--radius-large);
      background: var(--color-surface-raised);
      color: var(--color-foreground);
      box-shadow: var(--shadow-popover);
    }

    .confirm-dialog:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-info);
      outline-offset: var(--border-thickness-xs);
    }

    .confirm-dialog::backdrop {
      background: var(--color-backdrop);
    }

    .confirm-form {
      display: grid;
      gap: var(--gap-m);
    }

    .confirm-title {
      margin: 0;
      font-size: var(--ni-18);
    }

    .confirm-text {
      margin: 0;
      color: var(--color-muted);
      font-size: var(--ni-14);
      line-height: 1.6;
    }
  }
</style>
