<script lang="ts">
  import { formatPremiumPrice } from "./formatPremiumPrice.ts";
  import { PREMIUM_PLAN } from "./PREMIUM_PLAN.ts";
  import type { PremiumPlansProps } from "./PremiumPlansProps.ts";

  const { tier, amount, signedIn, ready, busy, onUpgrade }: PremiumPlansProps =
    $props();

  const upgradeLabel = $derived(
    !signedIn
      ? "Sign in to upgrade"
      : !ready
        ? "Checking your plan…"
        : "Upgrade to Premium",
  );
</script>

<section class="trakt-premium-plans" aria-label="Plans">
  <div class="plan-grid">
    <article class="plan" data-tier="standard">
      <header class="plan-head">
        <h2 class="plan-name">Standard</h2>
        <p class="price"><strong class="price-amount">$0</strong></p>
        <p class="plan-summary">
          For community apps, personal tools, and getting started.
        </p>
      </header>
      <ul class="features">
        <li class="feature"><span>Standard rate limits</span></li>
        <li class="feature">
          <span
            >Public API at <code class="inline-code">api.trakt.tv</code></span
          >
        </li>
        <li class="feature"><span>Public endpoints</span></li>
        <li class="feature">
          <span>Counts toward the community app limit</span>
        </li>
        <li class="feature"><span>Community support on GitHub</span></li>
      </ul>
      <footer>
        {#if tier === "standard"}<span class="current">Your current plan</span
          >{:else if tier === "premium"}<span class="current"
            >Included with every account</span
          >{:else}<span class="current" aria-hidden="true"></span>{/if}
      </footer>
    </article>

    <article class="plan" data-tier="premium">
      <header class="plan-head">
        <h2 class="plan-name">Premium</h2>
        <p class="price">
          <strong class="price-amount">{formatPremiumPrice(amount)}</strong
          ><span class="price-unit">/month</span>
        </p>
        <p class="plan-summary">
          Billed monthly, cancel any time. For apps that need headroom and more
          of the API.
        </p>
      </header>
      <ul class="features">
        <li class="feature"><span>Higher rate limits</span></li>
        <li class="feature">
          <span
            >Premium API at <code class="inline-code">apiz.trakt.tv</code></span
          >
        </li>
        <li class="feature">
          <span>Public and Limited Access endpoints</span>
        </li>
        <li class="feature">
          <span>Exempt from the community app limit</span>
        </li>
        <li class="feature"><span>Everything in Standard</span></li>
      </ul>
      <footer>
        {#if tier === "premium"}<span class="current">Your current plan</span
          >{:else}<button
            type="button"
            class="upgrade"
            disabled={busy || !signedIn || !ready}
            onclick={onUpgrade}
            >{busy ? "Opening checkout…" : upgradeLabel}</button
          >{/if}
      </footer>
    </article>
  </div>
</section>

<style lang="scss">
  @use "../../../style/action-button" as action;

  .trakt-premium-plans {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;

    .plan-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(var(--ni-280), 1fr));
      gap: var(--gap-l);
      width: 100%;
      max-width: var(--ni-768);
    }

    .plan {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: var(--gap-l);
      padding: var(--gap-xl);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--radius-large);
      background: var(--color-surface);
    }

    .plan[data-tier="premium"] {
      border-color: color-mix(
        in srgb,
        var(--color-accent) 60%,
        var(--color-border)
      );
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-accent) 12%, transparent),
          transparent 55%
        ),
        var(--color-surface);
      box-shadow: 0 0 0 var(--ni-1)
        color-mix(in srgb, var(--color-accent) 20%, transparent);
    }

    .plan-head {
      display: grid;
      gap: var(--gap-xs);
    }

    .plan-name {
      margin: 0;
      font-size: var(--ni-16);
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .price {
      display: flex;
      align-items: baseline;
      gap: var(--gap-xxs);
      margin: 0;
    }

    .price-amount {
      font-size: var(--ni-36);
      letter-spacing: -0.04em;
    }

    .price-unit {
      color: var(--color-muted);
      font-size: var(--ni-14);
    }

    .plan-summary {
      margin: 0;
      color: var(--color-muted);
      font-size: var(--ni-14);
      line-height: 1.6;
    }

    .features {
      display: grid;
      gap: var(--gap-s);
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: var(--ni-14);
      line-height: 1.5;
    }

    .feature {
      display: flex;
      align-items: baseline;
      gap: var(--gap-xs);
    }

    .feature::before {
      content: "✓";
      flex: 0 0 auto;
      color: var(--color-success);
      font-weight: 700;
    }

    .plan[data-tier="premium"] .feature::before {
      color: var(--color-accent-hover);
    }

    .inline-code {
      font-family: var(--font-mono);
      font-size: 0.9em;
    }

    .current {
      display: inline-flex;
      align-items: center;
      min-height: var(--ni-38);
      color: var(--color-muted);
      font-size: var(--ni-14);
    }

    .upgrade {
      @include action.base;

      width: 100%;
      min-height: var(--ni-38);
      border-color: transparent;
      background: var(--color-accent);
      color: var(--color-foreground);
      font-size: var(--ni-14);
    }

    .upgrade:hover:not(:disabled) {
      background: var(--color-accent-hover);
      border-color: transparent;
    }
  }
</style>
