import type { ResizablePanel } from './ResizablePanel.ts';

const SIDEBAR_MIN_WIDTH = 240;
const SIDEBAR_MAX_WIDTH = 560;
const REQUEST_MIN_WIDTH = 600;
const REQUEST_MAX_WIDTH = 1_200;

export function clampPanelWidth({
  panel,
  width,
}: {
  panel: ResizablePanel;
  width: number;
}): number {
  const minimum = panel === 'sidebar' ? SIDEBAR_MIN_WIDTH : REQUEST_MIN_WIDTH;
  const maximum = panel === 'sidebar' ? SIDEBAR_MAX_WIDTH : REQUEST_MAX_WIDTH;
  return Math.min(maximum, Math.max(minimum, width));
}
