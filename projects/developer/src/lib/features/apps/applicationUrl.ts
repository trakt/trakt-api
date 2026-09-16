/** The name is a display hint; the API remains authoritative for app data. */
export function applicationUrl(
  id: number | undefined,
  name?: string,
  edit = false,
): string {
  if (id === undefined) return '/apps';
  const path = `/apps/${id}${edit ? '/edit' : ''}`;
  const label = name?.trim().slice(0, 255);
  return label ? `${path}?${new URLSearchParams({ name: label })}` : path;
}
