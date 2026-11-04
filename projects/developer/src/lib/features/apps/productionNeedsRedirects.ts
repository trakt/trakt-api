import type { Application } from './Application.ts';

export function productionNeedsRedirects(
  app: Pick<
    Application,
    'dev' | 'redirect_uri' | 'app_type' | 'linked_application'
  >,
  apps: ReadonlyArray<Pick<Application, 'id' | 'redirect_uri'>>,
): boolean {
  if (!app.dev) {
    return (
      app.app_type === 'production_read_only' || app.redirect_uri.trim() === ''
    );
  }

  const linked = app.linked_application;
  if (!linked || linked.read_only) return true;

  const production = apps.find(({ id }) => id === linked.id);
  return production === undefined || production.redirect_uri.trim() === '';
}
