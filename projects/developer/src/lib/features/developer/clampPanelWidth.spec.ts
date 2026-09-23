import { describe, expect, it } from 'vitest';
import { clampPanelWidth } from './clampPanelWidth.ts';

describe('clampPanelWidth', () => {
  it('should pass through a sidebar width within bounds', () => {
    expect(clampPanelWidth({ panel: 'sidebar', width: 300 })).toBe(300);
  });

  it('should clamp a sidebar width below the minimum', () => {
    expect(clampPanelWidth({ panel: 'sidebar', width: 100 })).toBe(240);
  });

  it('should clamp a sidebar width above the maximum', () => {
    expect(clampPanelWidth({ panel: 'sidebar', width: 900 })).toBe(560);
  });

  it('should pass through a request panel width within bounds', () => {
    expect(clampPanelWidth({ panel: 'request', width: 800 })).toBe(800);
  });

  it('should clamp a request panel width below the minimum', () => {
    expect(clampPanelWidth({ panel: 'request', width: 100 })).toBe(600);
  });

  it('should clamp a request panel width above the maximum', () => {
    expect(clampPanelWidth({ panel: 'request', width: 2_000 })).toBe(1_200);
  });
});
