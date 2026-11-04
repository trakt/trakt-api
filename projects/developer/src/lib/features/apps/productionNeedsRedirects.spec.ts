import { describe, expect, it } from 'vitest';
import { productionNeedsRedirects } from './productionNeedsRedirects.ts';

const callback = 'https://example.app/callback';
const linked = {
  id: 2,
  name: 'Production app',
  dev: false,
  read_only: false,
  has_client_secret: false,
};
const dev = { dev: true, redirect_uri: 'http://localhost/callback' };
const production = { dev: false, redirect_uri: callback };

describe('productionNeedsRedirects', () => {
  it('asks for callbacks when the Production app does not exist yet', () => {
    expect(productionNeedsRedirects(dev, [])).toBe(true);
  });

  it('asks for callbacks on both sides of a pair when Production has none', () => {
    expect(
      productionNeedsRedirects({ ...production, redirect_uri: '' }, []),
    ).toBe(true);
    expect(
      productionNeedsRedirects({ ...dev, linked_application: linked }, [
        { id: linked.id, redirect_uri: '' },
      ]),
    ).toBe(true);
  });

  it('asks for callbacks when the linked Production app is not listed', () => {
    expect(
      productionNeedsRedirects({ ...dev, linked_application: linked }, []),
    ).toBe(true);
  });

  it('keeps existing Production callbacks', () => {
    expect(productionNeedsRedirects(production, [])).toBe(false);
    expect(
      productionNeedsRedirects({ ...dev, linked_application: linked }, [
        { id: linked.id, redirect_uri: callback },
      ]),
    ).toBe(false);
  });

  it('still asks for callbacks when upgrading a read-only app', () => {
    expect(
      productionNeedsRedirects(
        { ...production, app_type: 'production_read_only' },
        [],
      ),
    ).toBe(true);
    expect(
      productionNeedsRedirects(
        { ...dev, linked_application: { ...linked, read_only: true } },
        [],
      ),
    ).toBe(true);
  });
});
