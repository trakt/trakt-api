const FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatPremiumPrice(amount: number): string {
  return FORMATTER.format(amount);
}
