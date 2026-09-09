export function guideUpdatedAt(source: string, now = Date.now()) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1];
  const value = frontmatter?.match(/^updatedAt:\s*(\S+)/m)?.[1];
  if (!value) return null;

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;

  const days = Math.max(0, Math.floor((now - timestamp) / 86_400_000));
  let relative = days === 0
    ? 'today'
    : days === 1
    ? 'yesterday'
    : `${days} days ago`;

  if (days >= 30) {
    const years = days >= 365;
    const amount = Math.max(1, Math.round(days / (years ? 365 : 30)));
    const unit = years ? 'year' : 'month';
    relative = `about ${amount} ${unit}${amount === 1 ? '' : 's'} ago`;
  }

  return {
    datetime: new Date(timestamp).toISOString(),
    relative,
    date: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeZone: 'UTC',
    }).format(timestamp),
  };
}
