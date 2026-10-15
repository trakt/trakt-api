<script lang="ts">
  import type { DeveloperPlanCardProps } from "./DeveloperPlanCardProps.ts";
  import TierBadge from "./TierBadge.svelte";

  const { tier, count, limit }: DeveloperPlanCardProps = $props();

  const appsLabel = $derived(count === 1 ? "1 app" : `${count} apps`);
  const quotaLabel = $derived(
    tier === "standard"
      ? `${count} of ${limit} community apps`
      : `${appsLabel} with raised limits`,
  );
</script>

<aside class="trakt-developer-plan-card" aria-label="Plan">
  <div class="plan-row">
    <TierBadge {tier} withPlan />
    <a class="plan-link" href="/premium"
      >{tier === "standard" ? "Upgrade →" : "Manage plan →"}</a
    >
  </div>
  <p class="quota">{quotaLabel}</p>
</aside>

<style lang="scss">
  .trakt-developer-plan-card {
    display: grid;
    gap: var(--gap-s);
    padding: var(--gap-l);
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--radius-large);
    background: var(--color-surface);

    .plan-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);
    }

    .plan-link {
      color: var(--color-info);
      font-size: var(--ni-12);
      text-decoration: none;
    }

    .quota {
      margin: 0;
      color: var(--color-muted);
      font-size: var(--ni-14);
      line-height: 1.6;
    }
  }
</style>
