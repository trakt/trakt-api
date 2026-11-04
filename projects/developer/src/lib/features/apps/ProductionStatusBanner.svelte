<script lang="ts">
  import type { ProductionReview } from "./ProductionReview.ts";
  import { productionStatusCopy } from "./productionStatusCopy.ts";

  const {
    review,
    fullProduction,
  }: { review: ProductionReview | null | undefined; fullProduction: boolean } =
    $props();
  const copy = $derived(productionStatusCopy(review, fullProduction));
</script>

{#if copy}<div
    class="trakt-production-status-banner"
    data-tone={copy.tone}
    role="status"
  >
    <strong class="status-title">{copy.title}</strong>
    {#if review?.review_note}<blockquote class="status-note">
        {review.review_note}
      </blockquote>{/if}
    <p class="status-detail">{copy.detail}</p>
  </div>{/if}

<style lang="scss">
  .trakt-production-status-banner {
    --tone: var(--color-info);

    display: grid;
    gap: var(--gap-xs);
    padding: var(--gap-m);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--tone) 40%, var(--color-border));
    border-radius: var(--radius-control);
    background: color-mix(in srgb, var(--tone) 9%, transparent);
    font-size: 13px;

    &[data-tone="warning"] {
      --tone: var(--color-warning);
    }

    &[data-tone="success"] {
      --tone: var(--color-success);
    }

    &[data-tone="danger"] {
      --tone: var(--color-danger);
    }

    .status-title {
      color: var(--tone);
    }

    .status-note {
      margin: 0;
      padding-inline-start: var(--gap-s);
      border-inline-start: var(--border-thickness-xs) solid var(--tone);
      color: var(--color-foreground);
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .status-detail {
      margin: 0;
      color: var(--color-muted);
      line-height: 1.6;
    }
  }
</style>
