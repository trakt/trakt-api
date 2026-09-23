const NAME_HINT_LIMIT = 255;

/** The name is a display hint; the API remains authoritative for app data. */
export function applicationUrl({
  id,
  name,
  edit = false,
}: {
  id: number | undefined;
  name?: string;
  edit?: boolean;
}): string {
  if (id === undefined) return '/apps';
  const path = `/apps/${id}${edit ? '/edit' : ''}`;
  const label = name?.trim().slice(0, NAME_HINT_LIMIT);
  return label ? `${path}?${new URLSearchParams({ name: label })}` : path;
}

export function applicationNameFrom(url: URL): string | undefined {
  return url.searchParams.get('name')?.trim().slice(0, NAME_HINT_LIMIT);
}
